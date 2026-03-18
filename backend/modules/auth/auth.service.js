const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("./token.service");
const { sendOtp, verifyOtp } = require("./otp.service");

exports.register = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
    isFirstLogin: true // make sure new users start with this flag
  });

  await sendOtp(user.email);
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  if (!user.isVerified) throw new Error("Email not verified");

  // Handle 2FA
  if (user.isTwoFactorEnabled) {
    const tempToken = generateToken({ id: user._id }, "5m"); // short expiry
    return { requires2FA: true, tempToken };
  }

  const token = generateToken(user);

  // First login check
  let firstLogin = false;
  if (user.isFirstLogin) {
    firstLogin = true;
    user.isFirstLogin = false;   // flip flag
    await user.save();           // persist change
  }

  return {
    token,
    firstLogin,
    user: {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      email: user.email
    }
  };
};

exports.verifyEmail = async ({ email, otp }) => {
  const valid = verifyOtp(email, otp);
  if (!valid) throw new Error("Invalid OTP");

  await User.findOneAndUpdate({ email }, { isVerified: true });
};

exports.resendOtp = async (email) => {
  await sendOtp(email);
};

exports.requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  sendOtp(email); // logs OTP in console
};

exports.resetPassword = async ({ email, otp, newPassword }) => {
  const valid = verifyOtp(email, otp);
  if (!valid) throw new Error("Invalid OTP");

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email },
    { password: hashed }
  );
};
