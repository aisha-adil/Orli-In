const router = require("express").Router();
const controller = require("./customer.controller");

// Browse & Search Products
router.get("/products", controller.getProducts);
router.get("/products/:id", controller.getProductDetails);

// Orders
router.post("/orders", controller.placeOrder);
router.get("/orders/:customerId", controller.getOrders);

module.exports = router;
