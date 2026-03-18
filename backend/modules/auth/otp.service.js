const { sendEmail } = require("../../shared/services/email.service");

const otpStore = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

exports.sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  // Also log to console for dev convenience
  console.log(`📧 OTP for ${email}: ${otp}`);

  // Send via SMTP (falls back to console if not configured)
  await sendEmail({
    to: email,
    subject: "Orli — Verify your email",
    html: `
      <div style="font-family: 'Poppins', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #f9f9f9;">
        <h1 style="color: #1a1a1a; margin-bottom: 8px;">Verify your email</h1>
        <p style="color: #666; margin-bottom: 24px;">Use the code below to complete registration on Orli.</p>
        <div style="background: #1a1a1a; color: #fff; text-align: center; padding: 20px; border-radius: 12px; letter-spacing: 8px; font-size: 2rem; font-weight: 700;">
          ${otp}
        </div>
        <p style="color: #999; margin-top: 24px; font-size: 0.85rem;">This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

exports.verifyOtp = (email, otp) => {
  const record = otpStore.get(email);

  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  const isValid = record.otp === otp;

  if (isValid) {
    otpStore.delete(email);
  }

  return isValid;
};
