const Product = require("../product/product.model");

exports.getMyStorefront = async (designerId, query) => {
  const { page = 1, limit = 10, status, sort } = query;

  const filters = { designer: designerId };

  if (status === "published") filters.isPublished = true;
  if (status === "unpublished") filters.isPublished = false;

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  const products = await Product.find(filters)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filters);

  const statsAgg = await Product.aggregate([
    { $match: { designer: designerId } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        published: {
          $sum: { $cond: ["$isPublished", 1, 0] }
        },
        unpublished: {
          $sum: { $cond: ["$isPublished", 0, 1] }
        },
        totalRevenue: { $sum: "$totalRevenue" },
        totalSales: { $sum: "$totalSales" }
      }
    }
  ]);

  const stats = statsAgg[0] || {
    totalProducts: 0,
    published: 0,
    unpublished: 0,
    totalRevenue: 0,
    totalSales: 0
  };

  return {
    stats,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    },
    products
  };
};