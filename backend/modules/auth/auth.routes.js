const router = require("express").Router();
const controller = require("./auth.controller");
const auth = require("../../shared/middlewares/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/verify-email", controller.verifyEmail);
router.post("/resend-otp", controller.resendOtp);
router.post("/2fa/setup", auth, controller.setup2FA);
router.post("/2fa/verify", auth, controller.verify2FA);
router.post("/2fa/login-validate", controller.validateLogin2FA);
router.patch("/2fa/toggle", auth, controller.toggle2FA);
router.post("/forgot-password", controller.requestPasswordReset);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
