import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { protect, adminOrLister } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validationMiddleware.js';

const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
];

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, adminOrLister, validate(productValidation), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, adminOrLister, validate(productValidation), updateProduct)
    .delete(protect, adminOrLister, deleteProduct);

export default router;
