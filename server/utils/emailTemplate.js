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
