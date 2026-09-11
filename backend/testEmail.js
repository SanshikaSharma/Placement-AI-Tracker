require("dotenv").config();

const { sendEmail } = require("./utils/emailService");

const testEmail = async () => {
  const result = await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "Placement AI Tracker - Test Email",
    text: "This is a test email from Placement AI Tracker.",
    html: `
      <h2>Placement AI Tracker</h2>
      <p>This is a test email.</p>
      <p>Email system is working successfully. ✅</p>
    `,
  });

  console.log(result);
};

testEmail();