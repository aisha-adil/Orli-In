const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (buffer, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    console.log(`Uploading to Cloudinary with resourceType: ${resourceType}, buffer size: ${buffer.length}`);
    const stream = cloudinary.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        console.log('Cloudinary upload success:', result.secure_url);
        resolve(result.secure_url);
      }
    });
    stream.end(buffer);
  });
};

// Create product
router.post('/', auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'designFiles', maxCount: 5 }, { name: 'sizeTable', maxCount: 1 }]), async (req, res) => {
  try {
    console.log('Create product - Received files:', req.files);
    console.log('Create product - Received body:', req.body);
    console.log('Create product - Content-Type:', req.headers['content-type']);
    const { title, description, variants, tags } = req.body;
    const parsedVariants = variants ? JSON.parse(variants) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];
    let images = [];
    if (req.body.existingImages) {
      // Use existing images for duplication
      images = JSON.parse(req.body.existingImages);
      console.log(`Using ${images.length} existing images`);
    } else if (req.files.images) {
      console.log(`Processing ${req.files.images.length} new images`);
      images = await Promise.all(req.files.images.map(file => uploadToCloudinary(file.buffer, 'image')));
    }

    let designFiles = [];
    if (req.body.existingDesignFiles) {
      // Use existing design files for duplication
      designFiles = JSON.parse(req.body.existingDesignFiles);
      console.log(`Using ${designFiles.length} existing design files`);
    } else if (req.files.designFiles) {
      designFiles = await Promise.all(req.files.designFiles.map(file => uploadToCloudinary(file.buffer, 'raw')));
    }

    let sizeTable = '';
    if (req.body.existingSizeTable) {
      // Use existing size table for duplication
      sizeTable = req.body.existingSizeTable;
      console.log(`Using existing size table: ${sizeTable}`);
    } else if (req.files.sizeTable && req.files.sizeTable[0]) {
      sizeTable = await uploadToCloudinary(req.files.sizeTable[0].buffer, 'image');
    }
    const processedVariants = parsedVariants.map(variant => ({
      ...variant,
      productionTime: parseInt(variant.productionTime) || 1,
      shippingTime: parseInt(variant.shippingTime) || 1,
      inventory: Math.max(parseInt(variant.inventory) || 100, 100)
    }));
    const product = new Product({
      title,
      description,
      images,
      tags: parsedTags,
      variants: processedVariants,
      designFiles,
      sizeTable,
      manufacturer: req.manufacturer._id
    });
    await product.save();
    console.log('Product saved with images:', product.images);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products for manufacturer
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ manufacturer: req.manufacturer._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.manufacturer.toString() !== req.manufacturer._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.manufacturer.toString() !== req.manufacturer._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product published status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { published } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product || product.manufacturer.toString() !== req.manufacturer._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.published = published;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'designFiles', maxCount: 5 }, { name: 'sizeTable', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, variants, tags } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product || product.manufacturer.toString() !== req.manufacturer._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const parsedVariants = variants ? JSON.parse(variants) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];

    let images = product.images;
    if (req.files.images) {
      images = await Promise.all(req.files.images.map(file => uploadToCloudinary(file.buffer, 'image')));
    }
    let designFiles = product.designFiles;
    if (req.files.designFiles) {
      designFiles = await Promise.all(req.files.designFiles.map(file => uploadToCloudinary(file.buffer, 'raw')));
    }
    let sizeTable = product.sizeTable;
    if (req.files.sizeTable && req.files.sizeTable[0]) {
      sizeTable = await uploadToCloudinary(req.files.sizeTable[0].buffer, 'image');
    }

    const processedVariants = parsedVariants.map(variant => ({
      ...variant,
      productionTime: parseInt(variant.productionTime) || 1,
      shippingTime: parseInt(variant.shippingTime) || 1,
      inventory: Math.max(parseInt(variant.inventory) || 100, 100)
    }));

    product.title = title;
    product.description = description;
    product.tags = parsedTags;
    product.variants = processedVariants;
    product.images = images;
    product.designFiles = designFiles;
    product.sizeTable = sizeTable;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;