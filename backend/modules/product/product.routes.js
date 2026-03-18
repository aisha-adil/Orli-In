const express = require('express');
const router = express.Router();
const controller = require('./product.controller');

// Public storefront routes
router.get('/', controller.getAllProducts);
router.get('/recommendations', controller.getRecommendations);
router.get('/:id', controller.getProductById);

module.exports = router;
