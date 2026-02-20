import express from 'express';
import adminAuth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
  createApp,
  getApps,
  getAppById,
  updateApp,
  deleteApp,
} from '../controllers/appController.js';

const router = express.Router();

router.get('/', getApps);
router.get('/:id', getAppById);
// Accept both file and JSON body for icon/images
router.post('/', adminAuth, (req, res, next) => {
  // If multipart/form-data with file, use upload.single
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    upload.single('icon')(req, res, next);
  } else {
    upload.none()(req, res, next);
  }
}, createApp);
router.put('/:id', adminAuth, (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    upload.single('icon')(req, res, next);
  } else {
    upload.none()(req, res, next);
  }
}, updateApp);
router.delete('/:id', adminAuth, deleteApp);

export default router;
