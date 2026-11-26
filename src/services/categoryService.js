const categoryRepository = require('../repositories/categoryRepository');

const getAllCategories = () => categoryRepository.findAll();

const getCategoryById = (id) => categoryRepository.findById(id);

const createCategory = (category) => categoryRepository.create(category);

const updateCategory = (id, category) =>
  categoryRepository.update(id, category);

const deleteCategory = (id) => categoryRepository.delete(id);

const addProductToCategory = (categoryId, productId) =>
  categoryRepository.addProduct(categoryId, productId);

const removeProductFromCategory = (categoryId, productId) =>
  categoryRepository.removeProduct(categoryId, productId);

const getProductsByCategory = (categoryId) =>
  categoryRepository.findProducts(categoryId);

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addProductToCategory,
  removeProductFromCategory,
  getProductsByCategory
};
