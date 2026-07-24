import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  createUser,
  getAllUsers,
  deleteUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  logoutUser,
  syncCart,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { validate } from '../middleware/validationMiddleware.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window for auth routes
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' }
});

const router = express.Router();

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.route('/').post(validate(registerValidation), registerUser).get(protect, adminOnly, getAllUsers);
router.post('/login', authLimiter, validate(loginValidation), authUser);
router.post('/verify-otp', authLimiter, validate([
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('OTP is required')
]), verifyOTP);
router.post('/resend-otp', authLimiter, validate([body('email').isEmail()]), resendOTP);
router.post('/forgot-password', authLimiter, validate([body('email').isEmail()]), forgotPassword);
router.post('/reset-password', authLimiter, validate([
  body('email').isEmail(),
  body('otp').notEmpty(),
  body('newPassword').isLength({ min: 6 })
]), resetPassword);
router.post('/logout', logoutUser);
router.post('/cart', protect, syncCart);

router.route('/profile').get(protect, getUserProfile).put(protect, validate([
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
]), updateUserProfile);
router.route('/admin').post(protect, adminOnly, validate(registerValidation), createUser);
router.route('/create').post(protect, adminOnly, validate(registerValidation), createUser);
router.route('/:id').delete(protect, adminOnly, deleteUser);

export default router;
