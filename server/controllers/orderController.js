import Order from '../models/Order.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const normalizedItems = orderItems.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity || item.qty || 1),
      size: item.size || 'Standard',
      image: item.image || '',
      imageColor: item.imageColor || '#ccc',
      price: Number(item.price),
      product: item.product || item._id || item.id,
    }));

    const normalizedAddress = {
      firstName: shippingAddress?.firstName || '',
      lastName: shippingAddress?.lastName || '',
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      postalCode: shippingAddress?.postalCode || shippingAddress?.zip || '',
      country: shippingAddress?.country || 'United States',
    };

    const order = new Order({
      orderItems: normalizedItems,
      user: req.user._id,
      shippingAddress: normalizedAddress,
      shippingMethod: shippingMethod || 'standard',
      paymentMethod: paymentMethod || 'Stripe',
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      trackingNumber: `ETH-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address || req.body.email_address || '',
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      
      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order by tracking number (public — returns safe non-PII data only)
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
const getOrderByTracking = async (req, res) => {
  try {
    const query = req.params.trackingNumber;

    let order = await Order.findOne({ trackingNumber: query });
    if (!order && mongoose.Types.ObjectId.isValid(query)) {
      order = await Order.findById(query);
    }

    if (order) {
      // Return complete tracking and order verification fields
      res.json({
        _id: order._id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        shippingMethod: order.shippingMethod,
        trackingHistory: order.trackingHistory,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
      });
    } else {
      res.status(404).json({ message: 'Order not found with that tracking number' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add tracking event
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const addTrackingEvent = async (req, res) => {
  try {
    const { status, location, message, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }
      if (status) {
        order.status = status;
        if (status === 'Delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
        }
      }
      
      const newEvent = {
        status: status || order.status,
        location: location || '',
        message: message || `Order status updated to ${status}`,
        timestamp: Date.now()
      };
      
      order.trackingHistory.push(newEvent);

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getOrderByTracking,
  addTrackingEvent,
};
