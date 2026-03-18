const router = require("express").Router();
const controller = require("./profile.controller");
const auth = require("../../../shared/middlewares/auth.middleware");
const role = require("../../../shared/middlewares/role.middleware");

// Protected routes
router.get("/me", auth, role("designer"), controller.getMyProfile);
router.put("/me", auth, role("designer"), controller.updateProfile);

// Public route
router.get("/:id", controller.getPublicProfile);

module.exports = router;
