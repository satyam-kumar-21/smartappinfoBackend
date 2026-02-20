import express from 'express';
import adminAuth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', adminAuth, upload.single('coverImage'), createBlog);
router.put('/:id', adminAuth, upload.single('coverImage'), updateBlog);
router.delete('/:id', adminAuth, deleteBlog);

export default router;
