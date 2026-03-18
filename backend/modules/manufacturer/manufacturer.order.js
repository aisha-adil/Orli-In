const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { productId, selectedVariant, quantity, customerInfo } = req.body;

    // Get the full product data
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the selected variant
    const variant = product.variants.find(v =>
      v.color === selectedVariant.color && v.size === selectedVariant.size
    );

    if (!variant) {
      return res.status(400).json({ message: 'Selected variant not found' });
    }

    // Calculate order total
    const orderTotal = variant.cost * quantity;

    // Create the order with embedded product data
    const order = new Order({
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        images: product.images,
        variants: product.variants,
        productionTime: product.productionTime,
        shippingTime: product.shippingTime,
        printSides: product.printSides,
        designFiles: product.designFiles,
        tags: product.tags
      },
      manufacturer: product.manufacturer,
      selectedVariant: {
        color: variant.color,
        size: variant.size,
        cost: variant.cost,
        inventory: variant.inventory
      },
      quantity,
      customerInfo,
      orderTotal
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get orders for manufacturer
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ manufacturer: req.manufacturer._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order || order.manufacturer.toString() !== req.manufacturer._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order details
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.manufacturer.toString() !== req.manufacturer._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;