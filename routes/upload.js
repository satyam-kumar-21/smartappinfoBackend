import express from 'express';
import adminAuth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Upload icon endpoint
router.post('/upload-icon', adminAuth, upload.single('icon'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'No icon file uploaded' });
  }
  res.json({ url: req.file.path });
});

// Upload images endpoint (multiple)
router.post('/upload-images', adminAuth, upload.array('images', 10), (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ error: 'No images uploaded' });
  }
  const urls = req.files.map(f => f.path);
  res.json({ urls });
});

export default router;
