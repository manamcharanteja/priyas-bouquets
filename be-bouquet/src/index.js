require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Webhook route must use raw body — register before express.json()
const paymentRoutes = require('./routes/payment');
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sarees', require('./routes/sarees'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', name: "Priya's Bouquets API" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
