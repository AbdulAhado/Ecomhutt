import express from 'express';
import {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from '../controllers/heroBannerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getHeroBanners)
  .post(protect, adminOnly, createHeroBanner);

router.route('/:id')
  .put(protect, adminOnly, updateHeroBanner)
  .delete(protect, adminOnly, deleteHeroBanner);

export default router;
