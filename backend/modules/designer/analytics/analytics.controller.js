const service = require("./analytics.service");

exports.getAnalytics = async (req, res, next) => {
  try {
    const data = await service.getDesignerAnalytics(
      req.user.id,
      req.query
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
};