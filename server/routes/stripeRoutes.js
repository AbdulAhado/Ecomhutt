import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getOrderBySession,
} from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Checkout session — requires authentication
router.post('/create-checkout-session', protect, createCheckoutSession);

// Get order by session ID — requires authentication
router.get('/session/:sessionId', protect, getOrderBySession);

export default router;

// Webhook is mounted separately in server.js with express.raw() middleware
// Export the handler so server.js can use it directly
export { handleWebhook };
