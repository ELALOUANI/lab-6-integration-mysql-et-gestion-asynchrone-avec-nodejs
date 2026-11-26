const pool = require('../config/db');
const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');

const getAllProducts = () => productRepository.findAll();

const getProductById = (id) => productRepository.findById(id);

const createProduct = async (product) => {
  const { categoryName, category_id: categoryIdInput, ...productDetails } = product;
  let normalizedCategoryName;
  let normalizedCategoryId;

  if (categoryName !== undefined) {
    if (typeof categoryName !== 'string' || categoryName.trim() === '') {
      const error = new TypeError('categoryName must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    normalizedCategoryName = categoryName.trim();
  }
  if (categoryIdInput !== undefined) {
    normalizedCategoryId = Number(categoryIdInput);
    if (!Number.isSafeInteger(normalizedCategoryId) || normalizedCategoryId < 1) {
      const error = new TypeError('category_id must be a positive integer');
      error.statusCode = 400;
      throw error;
    }
  }
  if (normalizedCategoryName !== undefined && normalizedCategoryId !== undefined) {
    const error = new TypeError('Provide either categoryName or category_id, not both');
    error.statusCode = 400;
    throw error;
  }

  return pool.withConnection(async (connection) => {
    await connection.beginTransaction();

    try {
      let categoryId;
      if (normalizedCategoryName !== undefined) {
        let category = await categoryRepository.findByName(
          normalizedCategoryName,
          connection
        );
        if (!category) {
          const result = await categoryRepository.create(
            { name: normalizedCategoryName },
            connection
          );
          category = { id: result.insertId };
        }
        categoryId = category.id;
      } else if (normalizedCategoryId !== undefined) {
        const category = await categoryRepository.findById(
          normalizedCategoryId,
          connection
        );
        if (!category) {
          const error = new Error('Category not found');
          error.statusCode = 404;
          throw error;
        }
        categoryId = category.id;
      }

      const result = await productRepository.create(productDetails, connection);
      if (categoryId !== undefined) {
        await categoryRepository.addProduct(categoryId, result.insertId, connection);
      }

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  });
};

const updateProduct = (id, product) =>
  productRepository.update(id, product);

const deleteProduct = (id) => productRepository.delete(id);

const searchProducts = (filters) => productRepository.search(filters);

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
