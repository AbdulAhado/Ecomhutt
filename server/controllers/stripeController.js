import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { getOrderConfirmationEmail } from '../utils/emailTemplate.js';

let stripeClient;
const getStripe = () => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeClient = new Stripe(key, {
      httpClient: Stripe.createFetchHttpClient(),
      timeout: 30000,
      maxNetworkRetries: 3,
    });
  }
  return stripeClient;
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the order belongs to the authenticated user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Prevent paying for already-paid orders
    if (order.isPaid || order.paymentStatus === 'succeeded') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Prevent creating a new session if one already exists and is not expired
    if (order.stripeSessionId) {
      try {
        const existingSession = await getStripe().checkout.sessions.retrieve(order.stripeSessionId);
        if (existingSession.status === 'open') {
          return res.json({ url: existingSession.url });
        }
      } catch (e) {
        // Session expired or invalid, create a new one
      }
    }

    // Re-verify prices from the database — NEVER trust frontend prices
    const productIds = order.orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const line_items = order.orderItems.map(item => {
      const dbProduct = productMap[item.product.toString()];
      // Use DB price if available, fall back to order price
      const unitPrice = dbProduct ? dbProduct.price : item.price;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            ...(item.size && { description: `Size: ${item.size}` }),
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      };
    });

    // Free delivery on all orders — no shipping fee charged



    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      client_reference_id: orderId,
      metadata: {
        orderId: orderId,
      },
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment/failure`,
    });

    // Store the session ID on the order
    order.stripeSessionId = session.id;
    order.paymentMethod = 'Stripe';
    await order.save();

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error.message, error.raw?.message || error.cause || '');
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
};

// @desc    Handle Stripe Webhook
// @route   POST /api/stripe/webhook
// @access  Public (verified via Stripe signature)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      // Verify the webhook signature
      event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // In development without webhook secret, parse the raw body
      console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set — skipping signature verification (DEV ONLY)');
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId || session.client_reference_id;

        if (!orderId) {
          console.error('Webhook: No orderId found in session metadata');
          break;
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.error(`Webhook: Order ${orderId} not found`);
          break;
        }

        // Idempotency: skip if already marked as succeeded
        if (order.paymentStatus === 'succeeded' && order.isPaid) {
          console.log(`Webhook: Order ${orderId} already paid — skipping duplicate`);
          break;
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentStatus = 'succeeded';
        order.stripeSessionId = session.id;
        order.stripePaymentIntentId = session.payment_intent;
        order.paymentResult = {
          id: session.payment_intent,
          status: session.payment_status,
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email || '',
        };

        await order.save();
        console.log(`✅ Webhook: Order ${orderId} marked as PAID`);

        // Send order confirmation email — fire-and-forget (never block the webhook)
        try {
          const customerEmail = session.customer_details?.email;
          const customerName = session.customer_details?.name;
          if (customerEmail) {
            const emailHtml = getOrderConfirmationEmail(customerName || 'Valued Customer', order);
            await sendEmail({
              email: customerEmail,
              subject: `✅ Order Confirmed — ${order.trackingNumber || order._id}`,
              message: emailHtml,
            });
            console.log(`📧 Order confirmation email sent to ${customerEmail}`);
          }
        } catch (emailErr) {
          console.error('Order confirmation email failed (non-fatal):', emailErr.message);
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId || session.client_reference_id;

        if (orderId) {
          const order = await Order.findById(orderId);
          if (order && order.paymentStatus !== 'succeeded') {
            order.paymentStatus = 'failed';
            await order.save();
            console.log(`⏰ Webhook: Order ${orderId} session expired`);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        // Already handled by checkout.session.completed in most cases
        console.log(`💰 Webhook: PaymentIntent ${event.data.object.id} succeeded`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // Find order by payment intent ID
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
        if (order && order.paymentStatus !== 'succeeded') {
          order.paymentStatus = 'failed';
          await order.save();
          console.log(`❌ Webhook: Order ${order._id} payment failed`);
        }
        break;
      }

      default:
        console.log(`ℹ️  Webhook: Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    // Still return 200 to prevent Stripe from retrying
    return res.status(200).json({ received: true, error: 'Processing error' });
  }

  res.status(200).json({ received: true });
};

// @desc    Get order by Stripe session ID (for success page)
// @route   GET /api/stripe/session/:sessionId
// @access  Private
const getOrderBySession = async (req, res) => {
  try {
    let order = await Order.findOne({ stripeSessionId: req.params.sessionId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found for this session' });
    }

    // Verify the order belongs to the authenticated user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Fallback reconciliation if webhook is delayed or running in dev without webhook forwarder
    if (!order.isPaid) {
      try {
        const session = await getStripe().checkout.sessions.retrieve(req.params.sessionId);
        if (session && session.payment_status === 'paid') {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentStatus = 'succeeded';
          order.stripePaymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
          order.paymentResult = {
            id: order.stripePaymentIntentId,
            status: session.payment_status,
            update_time: new Date().toISOString(),
            email_address: session.customer_details?.email || '',
          };
          await order.save();
          console.log(`✅ Order ${order._id} reconciled as PAID via session retrieve`);
        }
      } catch (stripeErr) {
        console.error('Error retrieving session from Stripe in getOrderBySession:', stripeErr.message);
      }
    }

    res.json({
      _id: order._id,
      isPaid: order.isPaid,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      trackingNumber: order.trackingNumber,
      orderItems: order.orderItems,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    });
  } catch (error) {
    console.error('Get order by session error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { createCheckoutSession, handleWebhook, getOrderBySession };
