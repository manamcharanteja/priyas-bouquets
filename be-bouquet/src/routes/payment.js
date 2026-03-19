const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const {
  sendOrderConfirmationToCustomer,
  sendNewOrderAlertToAdmin,
} = require('../utils/email');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json(razorpayOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/verify - verify after payment success
router.post('/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Create the order in DB
    const order = await Order.create({
      ...orderData,
      payment: {
        method: 'UPI',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
      },
      orderStatus: 'confirmed',
    });

    // Send emails
    await Promise.all([
      sendOrderConfirmationToCustomer(order),
      sendNewOrderAlertToAdmin(order),
    ]);

    res.json({ success: true, orderId: order.orderId, _id: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/webhook - Razorpay webhook (backup verification)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body);
    if (event.event === 'payment.captured') {
      const razorpayOrderId = event.payload.payment.entity.order_id;
      await Order.findOneAndUpdate(
        { 'payment.razorpayOrderId': razorpayOrderId },
        { 'payment.status': 'paid', orderStatus: 'confirmed' }
      );
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
