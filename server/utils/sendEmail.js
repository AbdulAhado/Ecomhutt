import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Uses Gmail SMTP service. Requires:
    //   EMAIL_USER = your Gmail address (e.g. you@gmail.com)
    //   EMAIL_PASS = 16-char Google App Password (not your Gmail login password)
    //               Generate at: https://myaccount.google.com/apppasswords
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"EcomHutt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;