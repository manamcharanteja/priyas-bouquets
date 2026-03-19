const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const {
  sendOrderConfirmationToCustomer,
  sendNewOrderAlertToAdmin,
  sendOrderStatusUpdate,
} = require('../utils/email');

const router = express.Router();

// POST /api/orders - create order after payment success
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/track?email=...&orderId=... - customer order tracking
router.get('/track', async (req, res) => {
  try {
    const { email, orderId } = req.query;
    const order = await Order.findOne({ orderId, 'customer.email': email });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - admin: all orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter['payment.status'] = paymentStatus;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id - admin: single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status - admin: update order status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await sendOrderStatusUpdate(order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/admin/stats - dashboard stats
router.get('/admin/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalOrders, todayOrders, monthOrders, pendingOrders] = await Promise.all([
      Order.countDocuments({ 'payment.status': 'paid' }),
      Order.countDocuments({ createdAt: { $gte: today }, 'payment.status': 'paid' }),
      Order.countDocuments({ createdAt: { $gte: monthStart }, 'payment.status': 'paid' }),
      Order.countDocuments({ orderStatus: 'pending' }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const monthRevenueResult = await Order.aggregate([
      { $match: { 'payment.status': 'paid', createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      totalOrders,
      todayOrders,
      monthOrders,
      pendingOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      monthRevenue: monthRevenueResult[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
