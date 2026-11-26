const express = require('express');
const productController = require('../controllers/productController');
const {
  validateId,
  validateProductCreate,
  validateProductUpdate
} = require('../middlewares/validation');

const router = express.Router();

router.get('/search', productController.searchProducts);
router.get('/', productController.getAllProducts);
router.post('/', validateProductCreate, productController.createProduct);
router.get('/:id', validateId('id'), productController.getProductById);
router.put(
  '/:id',
  validateId('id'),
  validateProductUpdate,
  productController.updateProduct
);
router.delete('/:id', validateId('id'), productController.deleteProduct);

module.exports = router;
