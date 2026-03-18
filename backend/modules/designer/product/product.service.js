const Product = require("./product.model");

exports.createProduct = async (designerId, data) => {
  return await Product.create({
    ...data,
    designer: designerId,
  });
};

exports.getDesignerProducts = async (designerId) => {
  return await Product.find({ designer: designerId }).sort({ createdAt: -1 });
};

exports.getProductById = async (productId, designerId) => {
  return await Product.findOne({
    _id: productId,
    designer: designerId,
  });
};

exports.updateProduct = async (productId, designerId, data) => {
  return await Product.findOneAndUpdate(
    { _id: productId, designer: designerId },
    data,
    { new: true }
  );
};

exports.deleteProduct = async (productId, designerId) => {
  return await Product.findOneAndDelete({
    _id: productId,
    designer: designerId,
  });
};

exports.togglePublish = async (productId, designerId, publishStatus) => {
  return await Product.findOneAndUpdate(
    { _id: productId, designer: designerId },
    { isPublished: publishStatus },
    { new: true }
  );
};
