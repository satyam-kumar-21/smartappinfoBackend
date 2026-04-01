// Helper to slugify app name (same as frontend)
function slugify(name) {
  return name?.toLowerCase().replace(/\s+/g, '-') || '';
}

// Escape special regex characters to prevent ReDoS / injection
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get app by slugified name
export const getAppBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const decodedSlug = decodeURIComponent(slug);
    
    // Split slug on one-or-more hyphens, escape each part for regex safety,
    // then join with a pattern that matches any mix of spaces/hyphens.
    // e.g. "camscanner---pdf-scanner-app" -> /^camscanner[\s\-]+pdf[\s\-]+scanner[\s\-]+app$/i
    const parts = decodedSlug.split(/-+/).filter(Boolean).map(escapeRegex);
    const namePattern = parts.join('[\\s\\-]+');
    const app = await App.findOne({ name: { $regex: new RegExp(`^${namePattern}$`, 'i') } });
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import App from '../models/App.js';

export const createApp = async (req, res) => {
  try {
    const {
      name,
      category,
      images = [],
      rating,
      votes,
      downloads,
      description1,
      description2,
      description3,
      playStoreUrl,
      appStoreUrl
    } = req.body;
    const icon = req.file?.path || req.body.icon;
    // ...existing code...
    const app = new App({
      name,
      category,
      icon,
      images,
      rating,
      votes,
      downloads,
      description1,
      description2,
      description3,
      playStoreUrl,
      appStoreUrl
    });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    console.error('CREATE APP ERROR:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

export const getApps = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // If search query exists, use aggregation pipeline for smart priority sorting
    if (search) {
      const searchTerm = search.toLowerCase();
      const searchRegex = new RegExp(searchTerm, 'i');

      const pipeline = [
        {
          $match: {
            $or: [
              { name: searchRegex },
              { category: searchRegex },
              { description1: searchRegex },
              { description2: searchRegex },
              { description3: searchRegex }
            ]
          }
        },
        {
          // Add score field based on field priority
          $addFields: {
            searchScore: {
              $add: [
                // Exact name match gets highest score (100)
                {
                  $cond: [
                    { $eq: [{ $toLower: '$name' }, searchTerm] },
                    100,
                    0
                  ]
                },
                // Name contains search term (50)
                {
                  $cond: [
                    { $regexMatch: { input: '$name', regex: searchRegex } },
                    50,
                    0
                  ]
                },
                // Category match (30)
                {
                  $cond: [
                    { $regexMatch: { input: '$category', regex: searchRegex } },
                    30,
                    0
                  ]
                },
                // Description matches (10)
                {
                  $cond: [
                    {
                      $or: [
                        { $regexMatch: { input: '$description1', regex: searchRegex } },
                        { $regexMatch: { input: '$description2', regex: searchRegex } },
                        { $regexMatch: { input: '$description3', regex: searchRegex } }
                      ]
                    },
                    10,
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          // Sort by search score (highest first), then by rating, then by creation date
          $sort: {
            searchScore: -1,
            rating: -1,
            createdAt: -1
          }
        }
      ];

      // Add category filter if provided
      if (category) {
        pipeline[0].$match.category = { $regex: category, $options: 'i' };
      }

      const [apps] = await Promise.all([
        App.aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: limitNum }
        ]),
        App.countDocuments({
          $or: [
            { name: searchRegex },
            { category: searchRegex },
            { description1: searchRegex },
            { description2: searchRegex },
            { description3: searchRegex }
          ],
          ...(category && { category: { $regex: category, $options: 'i' } })
        })
      ]);

      const total = await App.countDocuments({
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { description1: searchRegex },
          { description2: searchRegex },
          { description3: searchRegex }
        ],
        ...(category && { category: { $regex: category, $options: 'i' } })
      });

      return res.json({
        apps,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      });
    }

    // No search - just category filter
    let filter = {};
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    const [apps, total] = await Promise.all([
      App.find(filter)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      App.countDocuments(filter)
    ]);

    res.json({
      apps,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Batch endpoint: get apps for multiple categories in one request
export const getAppsByCategories = async (req, res) => {
  try {
    const { categories, limit = 9 } = req.query;
    if (!categories) {
      return res.status(400).json({ message: 'categories query param required' });
    }
    
    const catList = categories.split(',').map(c => c.trim()).filter(Boolean);
    const limitNum = Math.min(parseInt(limit, 10) || 9, 20);
    
    // Run all category queries in parallel
    const results = await Promise.all(
      catList.map(async (category) => {
        const apps = await App.find({ category: { $regex: category, $options: 'i' } })
          .sort({ rating: -1, createdAt: -1 })
          .limit(limitNum)
          .lean();
        return { category, apps };
      })
    );
    
    // Return as object keyed by category
    const data = {};
    for (const { category, apps } of results) {
      data[category] = apps;
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAppById = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApp = async (req, res) => {


  
  
  try {
    const {
      name,
      category,
      images = [],
      rating,
      votes,
      downloads,
      description1,
      description2,
      description3,
      playStoreUrl,
      appStoreUrl
    } = req.body;
    const update = {
      name,
      category,
      images,
      rating,
      votes,
      downloads,
      description1,
      description2,
      description3,
      playStoreUrl,
      appStoreUrl
    };
    if (req.file?.path) update.icon = req.file.path;
    else if (req.body.icon) update.icon = req.body.icon;
    const app = await App.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteApp = async (req, res) => {
  try {
    const app = await App.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json({ message: 'App deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
