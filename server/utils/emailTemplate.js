export const getEmailTemplate = (name, otp, purpose) => {
  const isVerification = purpose === 'verification';
  const title = isVerification ? 'Verify Your Email' : 'Reset Your Password';
  const preheader = isVerification 
    ? 'Your EcomHutt email verification code' 
    : 'Your EcomHutt password reset code';
    
  const messageText = isVerification
    ? 'Thank you for joining EcomHutt. To complete your registration and secure your account, please use the verification code below.'
    : 'We received a request to reset the password for your EcomHutt account. Please use the code below to set up a new password.';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1a1a1a;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #0f1011;
      padding: 30px 40px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 2px;
      margin: 0;
      text-decoration: none;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 16px;
      color: #0f1011;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #555555;
      margin-bottom: 30px;
    }
    .otp-box {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 24px;
      text-align: center;
      margin-bottom: 30px;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #0f1011;
      margin: 0;
    }
    .warning {
      font-size: 14px;
      color: #888888;
      line-height: 1.5;
    }
    .footer {
      background-color: #fdfdfd;
      border-top: 1px solid #f0f0f0;
      padding: 24px 40px;
      text-align: center;
    }
    .footer-text {
      font-size: 13px;
      color: #999999;
      margin: 0;
      line-height: 1.5;
    }
    /* Hide preheader text */
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader} - Code: ${otp}</span>
  <div class="container">
    <div class="header">
      <h1 class="logo">ECOMHUTT</h1>
    </div>
    
    <div class="content">
      <h2 class="greeting">Hello ${name},</h2>
      <p class="message">${messageText}</p>
      
      <div class="otp-box">
        <p class="otp-code">${otp}</p>
      </div>
      
      <p class="warning">
        This code will expire in <strong>5 minutes</strong>.<br>
        If you did not request this, please ignore this email or contact support if you have concerns.
      </p>
    </div>
    
    <div class="footer">
      <p class="footer-text">
        &copy; ${new Date().getFullYear()} EcomHutt. All rights reserved.<br>
        This is an automated message, please do not reply.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate an order confirmation email HTML
 * @param {string} customerName
 * @param {object} order - Mongoose Order document
 * @returns {string} HTML email string
 */
export const getOrderConfirmationEmail = (customerName, order) => {
  const itemsRows = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">
        ${item.name}${item.size ? ` <span style="color:#888;font-size:12px;">(${item.size})</span>` : ''}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const trackingUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/${order._id}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed — EcomHutt</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f5f5f5;color:#1a1a1a;">
  <div style="max-width:600px;margin:40px auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background-color:#0f1011;padding:30px 40px;text-align:center;">
      <h1 style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:2px;margin:0;">ECOMHUTT</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="width:56px;height:56px;background:#0f1011;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
          <span style="color:white;font-size:24px;">✓</span>
        </div>
        <h2 style="font-size:22px;font-weight:700;color:#0f1011;margin:0 0 8px;">Order Confirmed!</h2>
        <p style="color:#666;font-size:14px;margin:0;">Thank you, ${customerName}. Your order has been placed and payment received.</p>
      </div>

      <!-- Tracking Number -->
      <div style="background:#f8f9fa;border:1px solid #e9ecef;border-radius:6px;padding:16px 24px;margin-bottom:28px;text-align:center;">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;margin:0 0 6px;">Tracking Number</p>
        <p style="font-size:20px;font-weight:700;color:#0f1011;margin:0;font-family:monospace;">${order.trackingNumber || String(order._id).slice(-8).toUpperCase()}</p>
      </div>

      <!-- Order Items -->
      <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#888;margin:0 0 12px;">Order Summary</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="font-size:11px;font-weight:700;text-transform:uppercase;color:#aaa;text-align:left;padding-bottom:8px;border-bottom:2px solid #f0f0f0;">Item</th>
            <th style="font-size:11px;font-weight:700;text-transform:uppercase;color:#aaa;text-align:center;padding-bottom:8px;border-bottom:2px solid #f0f0f0;">Qty</th>
            <th style="font-size:11px;font-weight:700;text-transform:uppercase;color:#aaa;text-align:right;padding-bottom:8px;border-bottom:2px solid #f0f0f0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Pricing -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="font-size:14px;color:#666;padding:4px 0;">Subtotal</td>
          <td style="font-size:14px;color:#333;font-weight:600;text-align:right;padding:4px 0;">$${Number(order.itemsPrice).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#666;padding:4px 0;">Shipping</td>
          <td style="font-size:14px;color:#333;font-weight:600;text-align:right;padding:4px 0;">${order.shippingPrice === 0 ? 'Free' : `$${Number(order.shippingPrice).toFixed(2)}`}</td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#666;padding:4px 0;">Tax</td>
          <td style="font-size:14px;color:#333;font-weight:600;text-align:right;padding:4px 0;">$${Number(order.taxPrice).toFixed(2)}</td>
        </tr>
        <tr style="border-top:2px solid #0f1011;">
          <td style="font-size:16px;font-weight:700;color:#0f1011;padding:12px 0 4px;">Total Paid</td>
          <td style="font-size:16px;font-weight:700;color:#0f1011;text-align:right;padding:12px 0 4px;">$${Number(order.totalPrice).toFixed(2)}</td>
        </tr>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin-top:8px;">
        <a href="${trackingUrl}" style="display:inline-block;background-color:#0f1011;color:#ffffff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:14px 32px;text-decoration:none;border-radius:4px;">
          Track Your Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color:#fdfdfd;border-top:1px solid #f0f0f0;padding:24px 40px;text-align:center;">
      <p style="font-size:13px;color:#999;margin:0;line-height:1.5;">
        &copy; ${new Date().getFullYear()} EcomHutt. All rights reserved.<br>
        Questions? Contact us at support@ecomhutt.com
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

