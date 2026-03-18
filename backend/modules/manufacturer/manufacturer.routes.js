const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const Product = require("../../models/Product");

// GET /api/manufacturer/orders/:manufacturerId — All orders for a manufacturer
router.get("/orders/:manufacturerId", async (req, res) => {
  try {
    const orders = await Order.find({ manufacturer: req.params.manufacturerId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/manufacturer/orders/:orderId/status — Update order status
router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/manufacturer/products/:manufacturerId — All products by manufacturer
router.get("/products/:manufacturerId", async (req, res) => {
  try {
    const products = await Product.find({ manufacturer: req.params.manufacturerId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
