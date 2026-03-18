const Order = require("../order/order.model");
const mongoose = require("mongoose");

exports.getDesignerAnalytics = async (designerId, query) => {
  const { startDate, endDate, status } = query;

  const match = {
    designer: new mongoose.Types.ObjectId(designerId),
  };

  // Date filtering
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate)
      match.createdAt.$gte = new Date(startDate);
    if (endDate)
      match.createdAt.$lte = new Date(endDate);
  }

  if (status) {
    match.status = status;
  }

  const orders = await Order.aggregate([
    { $match: match },

    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
              completedOrders: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "completed"] },
                    1,
                    0,
                  ],
                },
              },
              rejectedOrders: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "rejected"] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],

        revenueByDate: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
              revenue: { $sum: "$totalAmount" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],

        topProducts: [
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.product",
              totalSold: { $sum: "$items.quantity" },
              revenue: { $sum: "$totalAmount" },
            },
          },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
        ],

        statusBreakdown: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const summary = orders[0].summary[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    rejectedOrders: 0,
  };

  const averageOrderValue =
    summary.totalOrders > 0
      ? summary.totalRevenue / summary.totalOrders
      : 0;

  return {
    summary: {
      ...summary,
      averageOrderValue,
    },
    revenueByDate: orders[0].revenueByDate,
    topProducts: orders[0].topProducts,
    statusBreakdown: orders[0].statusBreakdown,
  };
};