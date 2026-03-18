const service = require("./product.service");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("./product.validation");

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validateCreateProduct(req.body);
    if (errors.length > 0)
      return res.status(400).json({ errors });

    const product = await service.createProduct(
      req.user.id,
      req.body
    );

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await service.getDesignerProducts(req.user.id);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validateUpdateProduct(req.body);
    if (errors.length > 0)
      return res.status(400).json({ errors });

    const product = await service.updateProduct(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await service.deleteProduct(
      req.params.id,
      req.user.id
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.publishProduct = async (req, res, next) => {
  try {
    const product = await service.togglePublish(
      req.params.id,
      req.user.id,
      true
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product published", product });
  } catch (err) {
    next(err);
  }
};

exports.unpublishProduct = async (req, res, next) => {
  try {
    const product = await service.togglePublish(
      req.params.id,
      req.user.id,
      false
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product unpublished", product });
  } catch (err) {
    next(err);
  }
};
