// Helper to slugify app name (same as frontend)
function slugify(name) {
  return name?.toLowerCase().replace(/\s+/g, '-') || '';
}

// Get app by slugified name
export const getAppBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const allApps = await App.find({});
    const found = allApps.find(a => slugify(a.name) === slug);
    if (!found) return res.status(404).json({ message: 'App not found' });
    res.json(found);
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
    const { category, page = 1, limit = 20 } = req.query;
    let filter = {};
    if (category) {
      // Case-insensitive, partial match for category
      filter.category = { $regex: category, $options: 'i' };
    }
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    const [apps, total] = await Promise.all([
      App.find(filter)
        .sort({ createdAt: -1 })
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
