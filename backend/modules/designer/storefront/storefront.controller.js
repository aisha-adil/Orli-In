const service = require("./storefront.service");

exports.getMyStorefront = async (req, res, next) => {
  try {
    const data = await service.getMyStorefront(
      req.user.id,
      req.query
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};