const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  variants: [{
    color: String,
    size: String,
    cost: { type: Number, required: true },
    productionTime: { type: Number, required: true },
    shippingTime: { type: Number, required: true },
    inventory: { type: Number, default: 100, min: 100 }
  }],
  printSides: [{ type: String }],
  designFiles: [{ type: String }],
  sizeTable: { type: String }, // URL to size table image
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: [{ type: String }], // Tags for SEO and Recommendation Engine
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);