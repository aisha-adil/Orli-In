const Order = require("./order.model");
const Product = require("../product/product.model");

exports.createOrder = async (customerId, data) => {
  const product = await Product.findById(data.productId);

  if (!product || !product.isPublished)
    throw new Error("Product not available");

  const totalAmount = product.price * (data.quantity || 1);

  const order = await Order.create({
    customer: customerId,
    designer: product.designer,
    items: [
      {
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: data.quantity || 1,
      },
    ],
    totalAmount,
  });

  return order;
};

exports.getDesignerOrders = async (designerId, query) => {
  const { status } = query;

  const filters = { designer: designerId };
  if (status) filters.status = status;

  return await Order.find(filters)
    .populate("customer", "fullName email")
    .sort({ createdAt: -1 });
};

exports.getCustomerOrders = async (customerId) => {
  return await Order.find({ customer: customerId })
    .populate("designer", "fullName designerInfo.storeName")
    .sort({ createdAt: -1 });
};

exports.updateOrderStatus = async (orderId, designerId, status, reason) => {
  const order = await Order.findOne({
    _id: orderId,
    designer: designerId,
  });

  if (!order) throw new Error("Order not found");

  order.status = status;

  if (status === "rejected") {
    order.rejectionReason = reason;
  }

  if (status === "completed") {
    // Update product analytics
    const product = await Product.findById(order.items[0].product);

    product.totalSales += order.items[0].quantity;
    product.totalRevenue += order.totalAmount;

    await product.save();
  }

  await order.save();

  return order;
};