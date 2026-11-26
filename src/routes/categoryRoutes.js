const express = require('express');
const categoryController = require('../controllers/categoryController');
const {
  validateId,
  validateCategory
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post('/', validateCategory, categoryController.createCategory);
router.get('/:categoryId/products', validateId('categoryId'), categoryController.getProductsByCategory);
router.post(
  '/:categoryId/products/:productId',
  validateId('categoryId', 'productId'),
  categoryController.addProductToCategory
);
router.delete(
  '/:categoryId/products/:productId',
  validateId('categoryId', 'productId'),
  categoryController.removeProductFromCategory
);
router.get('/:id', validateId('id'), categoryController.getCategoryById);
router.put('/:id', validateId('id'), validateCategory, categoryController.updateCategory);
router.delete('/:id', validateId('id'), categoryController.deleteCategory);

module.exports = router;
