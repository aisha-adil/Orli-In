const Product = require("../../models/Product");
const Order = require("../../models/Order");

exports.getProducts = async (filters) => {
  const query = {};
  if (filters.keyword) query.title = { $regex: filters.keyword, $options: "i" };
  if (filters.category) query.tags = filters.category;
  return Product.find(query).limit(50);
};

exports.getProductDetails = async (id) => {
  return Product.findById(id);
};

exports.placeOrder = async (data) => {
  const order = new Order(data);
  return order.save();
};

exports.getOrders = async (customerId) => {
  return Order.find({ "customerInfo.email": customerId });
};
