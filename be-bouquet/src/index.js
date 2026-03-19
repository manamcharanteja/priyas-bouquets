require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Webhook route must use raw body — register before express.json()
const paymentRoutes = require('./routes/payment');
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sarees', require('./routes/sarees'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', name: "True Spark API" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
