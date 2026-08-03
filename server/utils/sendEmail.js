// import nodemailer from 'nodemailer';

// const sendEmail = async ({ email, subject, message }) => {
//   try {
//     // Create transporter using Gmail SMTP
//     console.log("EMAIL_USER =", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS =", process.env.EMAIL_PASS);
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER, // e.g. youremail@gmail.com
//         pass: process.env.EMAIL_PASS // 16-character Google App Password from .env
//       },
//     });

//     // Define email options
//     const mailOptions = {
//       from: `"EcomHutt" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: subject,
//       html: message,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${email}`);
//   } catch (error) {
//     console.error('Error sending email: ', error);
//     throw new Error('Email could not be sent');
//   }
// };

// export default sendEmail;
import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.verify();
    console.log("SMTP Server Connected Successfully");

    const mailOptions = {
      from: `"EcomHutt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;