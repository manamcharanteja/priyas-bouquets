const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  sareeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Saree' },
  name: String,
  price: Number,
  qty: Number,
  imageUrl: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: () => `PB-${Date.now().toString().slice(-6)}`,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
      },
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    payment: {
      method: { type: String, default: 'UPI' },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: String,
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
