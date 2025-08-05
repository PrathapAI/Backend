import express from 'express';
import { getSubCategories, getSubCategory, createSubCategory, updateSubCategory, deleteSubCategory } from '../controllers/subcategoryController.js';
const router = express.Router();

// GET /crud/subcategories?categoryId=1
router.get('/', getSubCategories);
// GET /crud/subcategories/:id
router.get('/:id', getSubCategory);
// POST /crud/subcategories
router.post('/', createSubCategory);
// PUT /crud/subcategories/:id
router.put('/:id', updateSubCategory);
// DELETE /crud/subcategories/:id
router.delete('/:id', deleteSubCategory);

export default router;
