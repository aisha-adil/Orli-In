const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email. Falls back to console.log if SMTP is not configured.
 */
exports.sendEmail = async ({ to, subject, html }) => {
  // If SMTP creds aren't set, just log to console (dev mode fallback)
  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com") {
    console.log("═══════════════════════════════════════");
    console.log("📧 EMAIL (SMTP not configured – console fallback)");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log("═══════════════════════════════════════");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Orli" <noreply@orli.com>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
  }
};
