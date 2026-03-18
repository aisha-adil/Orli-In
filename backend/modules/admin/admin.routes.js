const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

// GET /api/admin/stats — Dashboard metrics
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: "customer" });
    const designers = await User.countDocuments({ role: "designer" });
    const manufacturers = await User.countDocuments({ role: "manufacturer" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      customers,
      designers,
      manufacturers,
      totalProducts,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users — List all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -twoFactorSecret");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id — Remove a user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
