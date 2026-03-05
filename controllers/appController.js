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
    const { category } = req.query;
    const filter = category ? { category } : {};
    const apps = await App.find(filter).sort({ createdAt: -1 });
    res.json(apps);
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
