import express from 'express';
import { createCategory, getCategories, deleteCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', createCategory);
router.get('/', getCategories);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

export default router;
