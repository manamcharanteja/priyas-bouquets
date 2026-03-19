const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationToCustomer = async (order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f0e6d3;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #f0e6d3;text-align:center;">${item.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #f0e6d3;text-align:right;">₹${item.price * item.qty}</td>
      </tr>`
    )
    .join('');

  await transporter.sendMail({
    from: `"True Spark" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `Order Confirmed - ${order.orderId} | True Spark`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e8d5b7;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#8B1A1A,#C4760A);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🌸 True Spark</h1>
          <p style="color:#f5e6c8;margin:5px 0 0;">Thank you for your order!</p>
        </div>
        <div style="padding:30px;">
          <p style="color:#4a3728;">Dear <strong>${order.customer.name}</strong>,</p>
          <p style="color:#4a3728;">Your order <strong>#${order.orderId}</strong> has been confirmed. Here are your order details:</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <thead>
              <tr style="background:#f5e6c8;">
                <th style="padding:10px;text-align:left;color:#8B1A1A;">Item</th>
                <th style="padding:10px;text-align:center;color:#8B1A1A;">Qty</th>
                <th style="padding:10px;text-align:right;color:#8B1A1A;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:bold;color:#8B1A1A;">Total Paid</td>
                <td style="padding:12px;font-weight:bold;color:#8B1A1A;text-align:right;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          <div style="background:#f9f3ea;padding:15px;border-radius:6px;margin:20px 0;">
            <p style="margin:0;color:#4a3728;"><strong>Delivery Address:</strong><br/>
            ${order.customer.address.line1}, ${order.customer.address.line2 || ''}<br/>
            ${order.customer.address.city}, ${order.customer.address.state} - ${order.customer.address.pincode}</p>
          </div>
          <p style="color:#4a3728;">We'll notify you when your order is packed and shipped. For any queries, reply to this email.</p>
          <p style="color:#8B1A1A;font-style:italic;">With love, Priya 🌸</p>
        </div>
        <div style="background:#f5e6c8;padding:15px;text-align:center;">
          <p style="margin:0;color:#8B1A1A;font-size:13px;">True Spark | manamteja021@gmail.com</p>
        </div>
      </div>`,
  });
};

const sendNewOrderAlertToAdmin = async (order) => {
  const itemsList = order.items.map((i) => `${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');

  await transporter.sendMail({
    from: `"True Spark System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛍️ New Order #${order.orderId} - ₹${order.totalAmount}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
        <div style="background:#8B1A1A;padding:20px;">
          <h2 style="color:#fff;margin:0;">New Order Received!</h2>
        </div>
        <div style="padding:20px;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.email})</p>
          <p><strong>Phone:</strong> ${order.customer.phone}</p>
          <p><strong>Total:</strong> ₹${order.totalAmount}</p>
          <p><strong>Payment Status:</strong> ${order.payment.status}</p>
          <p><strong>Items:</strong></p>
          <pre style="background:#f5f5f5;padding:10px;border-radius:4px;">${itemsList}</pre>
          <p><strong>Address:</strong> ${order.customer.address.line1}, ${order.customer.address.city}, ${order.customer.address.pincode}</p>
          <a href="${process.env.FRONTEND_URL}/admin/orders/${order._id}" style="display:inline-block;background:#8B1A1A;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;margin-top:10px;">View Order in Admin</a>
        </div>
      </div>`,
  });
};

const sendOrderStatusUpdate = async (order) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    packed: 'Great news! Your order has been packed and is ready for dispatch.',
    shipped: 'Your order is on the way! It will reach you soon.',
    delivered: 'Your order has been delivered. Thank you for shopping with us! 🌸',
    cancelled: 'Your order has been cancelled. If you have any questions, please contact us.',
  };

  await transporter.sendMail({
    from: `"True Spark" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `Order Update #${order.orderId} - ${order.orderStatus.toUpperCase()} | True Spark`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e8d5b7;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#8B1A1A,#C4760A);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">🌸 True Spark</h1>
        </div>
        <div style="padding:30px;">
          <p style="color:#4a3728;">Dear <strong>${order.customer.name}</strong>,</p>
          <p style="color:#4a3728;">${statusMessages[order.orderStatus] || 'Your order status has been updated.'}</p>
          <p style="color:#4a3728;"><strong>Order ID:</strong> ${order.orderId}</p>
          <p style="color:#4a3728;"><strong>Status:</strong> <span style="color:#8B1A1A;font-weight:bold;">${order.orderStatus.toUpperCase()}</span></p>
          <p style="color:#8B1A1A;font-style:italic;">With love, Priya 🌸</p>
        </div>
      </div>`,
  });
};

module.exports = {
  sendOrderConfirmationToCustomer,
  sendNewOrderAlertToAdmin,
  sendOrderStatusUpdate,
};
