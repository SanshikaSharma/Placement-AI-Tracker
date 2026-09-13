const { google } = require("googleapis");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!process.env.GMAIL_CLIENT_ID) {
      console.error("GMAIL_CLIENT_ID is missing");
      return {
        success: false,
        message: "Gmail Client ID is missing",
      };
    }

    if (!process.env.GMAIL_CLIENT_SECRET) {
      console.error("GMAIL_CLIENT_SECRET is missing");
      return {
        success: false,
        message: "Gmail Client Secret is missing",
      };
    }

    if (!process.env.GMAIL_REFRESH_TOKEN) {
      console.error("GMAIL_REFRESH_TOKEN is missing");
      return {
        success: false,
        message: "Gmail Refresh Token is missing",
      };
    }

    if (!to) {
      console.error("Recipient email is missing");
      return {
        success: false,
        message: "Recipient email is required",
      };
    }

    const sender = process.env.EMAIL_USER;

    if (!sender) {
      console.error("EMAIL_USER is missing");
      return {
        success: false,
        message: "Sender email is missing",
      };
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const emailBody = html || text || "";

    const message = [
      `From: ${sender}`,
      `To: ${to}`,
      `Subject: ${subject || "Placement AI Tracker"}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      emailBody,
    ].join("\r\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`Email sent successfully to: ${to}`);
    console.log("Gmail Message ID:", response.data.id);

    return {
      success: true,
      messageId: response.data.id,
    };
  } catch (error) {
    console.error("Gmail Email Sending Error:", error.message);

    if (error.response?.data) {
      console.error("Gmail API Error:", error.response.data);
    }

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = { sendEmail };