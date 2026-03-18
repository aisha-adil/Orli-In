const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    images: [String],
    variants: [{
      color: String,
      size: String,
      cost: Number,
      inventory: Number
    }],
    productionTime: Number,
    shippingTime: Number,
    printSides: [String],
    designFiles: [String],
    tags: [String]
  },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  selectedVariant: {
    color: String,
    size: String,
    cost: Number,
    inventory: Number
  },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['Pending', 'Accepted', 'In Production', 'Shipped', 'Delivered', 'Declined'], default: 'Pending' },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    specialInstructions: String
  },
  orderTotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);