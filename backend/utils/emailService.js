const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration is missing");

      return {
        success: false,
        message: "Email configuration is missing",
      };
    }

    const mailOptions = {
      from: `"Placement AI Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

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