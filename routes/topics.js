import express from 'express';
import adminAuth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
  createTopic,
  getTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
} from '../controllers/topicController.js';

const router = express.Router();

router.get('/', getTopics);
router.get('/:id', getTopicById);
router.post('/', adminAuth, upload.single('coverImage'), createTopic);
router.put('/:id', adminAuth, upload.single('coverImage'), updateTopic);
router.delete('/:id', adminAuth, deleteTopic);

export default router;
