import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  createUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/create').post(protect, adminOnly, createUser);

export default router;
