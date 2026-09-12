const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // Force IPv4.
  // Render environment was trying to connect through IPv6.
  family: 4,

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration is missing");

      return {
        success: false,
        message: "Email configuration is missing",
      };
    }

    if (!to) {
      console.error("Email recipient is missing");

      return {
        success: false,
        message: "Email recipient is missing",
      };
    }

    const mailOptions = {
      from: `"Placement AI Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    console.log(`Sending email to: ${to}`);

    const info = await transporter.sendMail(mailOptions);

    console.log(
      "Email Sent Successfully:",
      info.messageId
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "Email Sending Error:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  sendEmail,
};