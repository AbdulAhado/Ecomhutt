import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect, adminOrLister } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, adminOrLister, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOrLister, updateProduct)
  .delete(protect, adminOrLister, deleteProduct);

export default router;
