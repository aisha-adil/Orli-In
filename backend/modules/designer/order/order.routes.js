const router = require("express").Router();
const controller = require("./order.controller");
const auth = require("../../../shared/middlewares/auth.middleware");
const role = require("../../../shared/middlewares/role.middleware");

// Customer creates order
router.post("/", auth, role("customer"), controller.createOrder);

// Customer views own orders
router.get("/my", auth, role("customer"), controller.getMyOrders);

// Designer views orders
router.get(
  "/designer",
  auth,
  role("designer"),
  controller.getDesignerOrders
);

// Designer updates status
router.patch(
  "/:id/status",
  auth,
  role("designer"),
  controller.updateStatus
);

module.exports = router;