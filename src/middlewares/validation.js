const { body, param, validationResult } = require('express-validator');

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Request validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }
  return next();
};

const validateId = (...names) => [
  ...names.map((name) =>
    param(name).isInt({ min: 1 }).withMessage(`${name} must be a positive integer`)
  ),
  checkValidation
];

const validateProductCreate = [
  body('name').isString().trim().notEmpty().isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('price').isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('categoryName').optional().isString().trim().notEmpty(),
  body('category_id').optional().isInt({ min: 1 }),
  checkValidation
];

const validateProductUpdate = [
  body('name').isString().trim().notEmpty().isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  checkValidation
];

const validateCategory = [
  body('name').isString().trim().notEmpty().isLength({ max: 100 }),
  checkValidation
];

module.exports = {
  validateId,
  validateProductCreate,
  validateProductUpdate,
  validateCategory
};
