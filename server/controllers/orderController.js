const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Mock Notification System
    console.log(`---------------------------------------------------`);
    console.log(`[NOTIFICATION] Sending Order Confirmation Email to: ${shippingAddress.email}`);
    console.log(`[NOTIFICATION] Sending SMS Alert to: ${shippingAddress.phoneNumber}`);
    console.log(`Subject: Order Placed Successfully - Order #${createdOrder._id}`);
    console.log(`---------------------------------------------------`);

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || 'Manual',
      status: req.body.status || 'Completed',
      update_time: req.body.update_time || Date.now(),
      email_address: req.body.payer?.email_address || order.user?.email || 'admin@example.com',
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email');
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Track order by ID and Email (Public)
// @route   GET /api/orders/track
// @access  Public
const trackOrder = asyncHandler(async (req, res) => {
  const { id, email } = req.query;

  if (!id || !email) {
    res.status(400);
    throw new Error('Please provide Order ID and Email');
  }

  // Find order by ID
  const order = await Order.findById(id).populate('user', 'email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify email matches (either from user profile or recorded shipping email)
  const userEmail = order.user?.email;
  const shippingEmail = order.shippingAddress?.email;

  if (
    (userEmail && userEmail.toLowerCase() === email.toLowerCase()) ||
    (shippingEmail && shippingEmail.toLowerCase() === email.toLowerCase())
  ) {
    res.json({
        _id: order._id,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        orderItems: order.orderItems, // Minimal info for tracking
        totalPrice: order.totalPrice,
        createdAt: order.createdAt
    });
  } else {
    res.status(401);
    throw new Error('Email does not match this order');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  trackOrder
};

