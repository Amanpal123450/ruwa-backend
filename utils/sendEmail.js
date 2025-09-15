const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP like: host, port, secure
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"HR System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email error:", error);
    throw new Error("Failed to send email");
  }
};
