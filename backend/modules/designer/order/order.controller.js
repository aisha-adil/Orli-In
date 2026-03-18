const service = require("./order.service");

exports.createOrder = async (req, res, next) => {
  try {
    const order = await service.createOrder(
      req.user.id,
      req.body
    );

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await service.getCustomerOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getDesignerOrders = async (req, res, next) => {
  try {
    const orders = await service.getDesignerOrders(
      req.user.id,
      req.query
    );

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await service.updateOrderStatus(
      req.params.id,
      req.user.id,
      req.body.status,
      req.body.reason
    );

    res.json(order);
  } catch (err) {
    next(err);
  }
};