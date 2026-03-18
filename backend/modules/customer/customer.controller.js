const service = require("./customer.service");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await service.getProducts(req.query);
    res.json(products);
  } catch (err) { next(err); }
};

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await service.getProductDetails(req.params.id);
    res.json(product);
  } catch (err) { next(err); }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const order = await service.placeOrder(req.body);
    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await service.getOrders(req.params.customerId);
    res.json(orders);
  } catch (err) { next(err); }
};
