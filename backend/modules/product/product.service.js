const Product = require('../../models/Product');
const User = require('../../models/User');

exports.getAllProducts = async () => {
  // Return all published products and populate the manufacturer Name
  return await Product.find({ published: true })
    .populate('manufacturer', 'fullName designerInfo manufacturerInfo');
};

exports.getProductById = async (id) => {
  return await Product.findById(id)
    .populate('manufacturer', 'fullName designerInfo manufacturerInfo');
};

exports.getRecommendations = async (userId) => {
  // Lightweight recommendation logic:
  // If no userId or no history, pick random products or most recently added.
  // In a real system, we match User.personalization tags with Product.metadata tags.
  
  if (userId) {
    const user = await User.findById(userId);
    if (user && user.personalization && user.personalization.tags) {
      const matched = await Product.find({
        published: true,
        metadata: { $in: user.personalization.tags }
      }).limit(5).populate('manufacturer', 'fullName');
      
      if (matched.length > 0) return matched;
    }
  }

  // Fallback to latest 6 published products for generic recommendations!
  return await Product.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('manufacturer', 'fullName');
};
