const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

// Sales trends
router.get('/trends', auth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    let groupBy;
    if (period === 'daily') {
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (period === 'weekly') {
      groupBy = { $dateToString: { format: "%Y-%U", date: "$createdAt" } };
    } else {
      groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }
    const trends = await Order.aggregate([
      { $match: { manufacturer: req.manufacturer._id, status: { $ne: 'Declined' } } },
      { $group: { _id: groupBy, revenue: { $sum: { $multiply: ["$variant.cost", "$quantity"] } }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Top products
router.get('/top-products', auth, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { manufacturer: req.manufacturer._id, status: { $ne: 'Declined' } } },
      { $group: { _id: "$product", revenue: { $sum: { $multiply: ["$variant.cost", "$quantity"] } }, orders: { $sum: 1 } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { title: '$product.title', revenue: 1, orders: 1 } },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const products = await require('../models/Product').countDocuments({ manufacturer: req.manufacturer._id });
    const orders = await require('../models/Order').countDocuments({ manufacturer: req.manufacturer._id });
    const revenue = await require('../models/Order').aggregate([
      { $match: { manufacturer: req.manufacturer._id, status: { $ne: 'Declined' } } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$variant.cost", "$quantity"] } } } }
    ]);
    res.json({ products, orders, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;