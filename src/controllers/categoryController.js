const categoryService = require('../services/categoryService');

const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json(category);
  } catch (error) {
    return next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await categoryService.getProductsByCategory(
      req.params.categoryId
    );
    return res.json(products);
  } catch (error) {
    return next(error);
  }
};

const addProductToCategory = async (req, res, next) => {
  try {
    const result = await categoryService.addProductToCategory(
      req.params.categoryId,
      req.params.productId
    );
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

const removeProductFromCategory = async (req, res, next) => {
  try {
    const result = await categoryService.removeProductFromCategory(
      req.params.categoryId,
      req.params.productId
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product association not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
  addProductToCategory,
  removeProductFromCategory
};
