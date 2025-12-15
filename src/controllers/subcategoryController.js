import SubCategory from '../models/SubCategory.js';
import Category from '../models/Category.js';

// Get all subcategories, or filter by categoryId
export const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { CategoryID: categoryId } : {};
    const subcategories = await SubCategory.findAll({
      where,
      include: [{ model: Category, attributes: ['CategoryName'] }]
    });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single subcategory by ID
export const getSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['CategoryName'] }]
    });
    if (!subcategory) return res.status(404).json({ error: 'Not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { SubCategoryName, CategoryID } = req.body;
    const newSubCategory = await SubCategory.create({ SubCategoryName, CategoryID });
    res.status(201).json(newSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const updated = await SubCategory.update(req.body, { where: { SubCategoryID: req.params.id }, returning: true });
    res.json(updated[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.destroy({ where: { SubCategoryID: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
