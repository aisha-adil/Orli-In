const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Setup 2FA (Generate Secret + QR)
exports.setup2FA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const secret = speakeasy.generateSecret({
    name: `Orli (${user.email})`,
    length: 20
  });

  user.twoFactorSecret = {
    base32: secret.base32,
    otpauth_url: secret.otpauth_url
  };

  await user.save();

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode
  };
};

// Verify setup and enable 2FA
exports.verifySetup = async (userId, token) => {
  const user = await User.findById(userId);

  if (!user?.twoFactorSecret?.base32)
    throw new Error("2FA not setup");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret.base32,
    encoding: "base32",
    token: String(token).trim(),
    window: 2
  });

  if (!verified) throw new Error("Invalid token");

  user.isTwoFactorEnabled = true;
  await user.save();
};

// Validate login 2FA
exports.validateLogin2FA = async (tempToken, token) => {
  const decoded = jwt.verify(
    tempToken,
    process.env.JWT_SECRET || "secretkey"
  );

  const user = await User.findById(decoded.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret.base32,
    encoding: "base32",
    token: String(token).trim(),
    window: 2
  });

  if (!verified) throw new Error("Invalid 2FA Code");

  return user;
};

// Temporary toggle (until settings page exists)
exports.toggle2FA = async (userId, enable) => {
  const user = await User.findById(userId);

  user.isTwoFactorEnabled = enable;

  if (!enable) {
    user.twoFactorSecret = undefined;
  }

  await user.save();
};