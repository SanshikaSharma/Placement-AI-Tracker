const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");

      return {
        success: false,
        message: "Email configuration is missing",
      };
    }

    if (!to) {
      console.error("Recipient email is missing");

      return {
        success: false,
        message: "Recipient email is required",
      };
    }

    console.log(`Sending email to: ${to}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          "Placement AI Tracker <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend Email Error:", data);

      return {
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Failed to send email",
      };
    }

    console.log("Email Sent Successfully:", data.id);

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error("Email Sending Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  sendEmail,
};