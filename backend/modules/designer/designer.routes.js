const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// GET /api/designer/portfolio/:userId
router.get("/portfolio/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.role !== "designer") return res.status(404).json({ message: "Designer not found" });
    res.json({
      storeName: user.designerInfo?.storeName,
      portfolio: user.designerInfo?.portfolio || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/designer/portfolio/:userId — Add a design
router.post("/portfolio/:userId", async (req, res) => {
  try {
    const { title, url } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user || user.role !== "designer") return res.status(404).json({ message: "Designer not found" });

    user.designerInfo.portfolio.push({ title, url, published: false });
    await user.save();
    res.json({ message: "Design added", portfolio: user.designerInfo.portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/designer/portfolio/:userId/:index/toggle — Publish/Unpublish
router.patch("/portfolio/:userId/:index/toggle", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.role !== "designer") return res.status(404).json({ message: "Designer not found" });

    const idx = parseInt(req.params.index);
    if (!user.designerInfo.portfolio[idx]) return res.status(404).json({ message: "Design not found" });

    user.designerInfo.portfolio[idx].published = !user.designerInfo.portfolio[idx].published;
    await user.save();
    res.json({ message: "Toggled", portfolio: user.designerInfo.portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/designer/portfolio/:userId/:index — Delete a design
router.delete("/portfolio/:userId/:index", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.role !== "designer") return res.status(404).json({ message: "Designer not found" });

    const idx = parseInt(req.params.index);
    user.designerInfo.portfolio.splice(idx, 1);
    await user.save();
    res.json({ message: "Deleted", portfolio: user.designerInfo.portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
