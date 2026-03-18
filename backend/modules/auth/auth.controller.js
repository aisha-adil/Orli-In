const service = require("./auth.service");
const twoFAService = require("./2fa.service");
const {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateResendOtp,
} = require("./auth.validation");

exports.register = async (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await service.register(req.body);

    res.status(201).json({
      message: "Registered. Verify email.",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

exports.setup2FA = async (req, res, next) => {
  try {
    const data = await twoFAService.setup2FA(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.verify2FA = async (req, res, next) => {
  try {
    await twoFAService.verifySetup(req.user.id, req.body.token);
    res.json({ message: "2FA Enabled Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.validateLogin2FA = async (req, res, next) => {
  try {
    const user = await twoFAService.validateLogin2FA(
      req.body.tempToken,
      req.body.token
    );
    const finalToken = generateToken(user);
    res.json({
      token: finalToken,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.toggle2FA = async (req, res, next) => {
  try {
    await twoFAService.toggle2FA(req.user.id, req.body.enable);

    res.json({
      message: `2FA ${req.body.enable ? "Enabled" : "Disabled"}`
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const data = await service.login(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const errors = validateVerifyEmail(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await service.verifyEmail(req.body);
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const errors = validateResendOtp(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await service.resendOtp(req.body.email);

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    await service.requestPasswordReset(email);
    res.json({ message: "OTP sent (check server console)" });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await service.resetPassword(req.body);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};