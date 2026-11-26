const productService = require('../services/productService');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const result = await productService.createProduct(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const result = await productService.searchProducts(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
