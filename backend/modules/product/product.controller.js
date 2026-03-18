const productService = require('./product.service');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    // Optionally accept user ID to tailor recommendations
    const { userId } = req.query;
    const recommended = await productService.getRecommendations(userId);
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
