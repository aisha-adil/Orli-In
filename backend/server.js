const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
console.log("Loaded PORT:", process.env.PORT);



require('dotenv').config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
console.log("Loaded PORT:", process.env.PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas (we’ll set this up soon)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Test route
app.get('/', (req, res) => {
    res.send("Backend is running!");
});

//routes
const authRoutes = require("./modules/auth/auth.routes.js");
app.use("/api/auth", authRoutes);

// Seed dummy data
app.post('/api/seed', async (req, res) => {
  try {
    const Manufacturer = require('./models/Manufacturer');
    const Product = require('./models/Product');
    const Order = require('./models/Order');

    // Get first manufacturer or create one
    let manufacturer = await Manufacturer.findOne();
    if (!manufacturer) {
      manufacturer = new Manufacturer({
        name: 'Test Manufacturer',
        email: 'test@example.com',
        password: 'hashedpassword' // In real app, hash it
      });
      await manufacturer.save();
    }

    // Create dummy products
    const products = [
      {
        title: 'Premium Cotton T-Shirt',
        description: 'High quality cotton t-shirt',
        images: ['https://via.placeholder.com/300'],
        tags: ['cotton', 't-shirt'],
        variants: [
          { color: '#000000', size: 'M', cost: 15, productionTime: 3, shippingTime: 5, inventory: 100 },
          { color: '#ffffff', size: 'L', cost: 15, productionTime: 3, shippingTime: 5, inventory: 100 }
        ],
        manufacturer: manufacturer._id
      },
      {
        title: 'Classic Hoodie',
        description: 'Comfortable hoodie',
        images: ['https://via.placeholder.com/300'],
        tags: ['hoodie', 'comfort'],
        variants: [
          { color: '#000000', size: 'M', cost: 25, productionTime: 5, shippingTime: 7, inventory: 100 }
        ],
        manufacturer: manufacturer._id
      }
    ];

    const createdProducts = await Product.insertMany(products);

    // Create dummy orders
    const orders = [];
    const statuses = ['Pending', 'Accepted', 'In Production', 'Shipped', 'Delivered'];
    for (let i = 0; i < 20; i++) {
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const variant = product.variants[Math.floor(Math.random() * product.variants.length)];
      orders.push({
        product: product._id,
        manufacturer: manufacturer._id,
        variant: {
          color: variant.color,
          size: variant.size,
          cost: variant.cost
        },
        quantity: Math.floor(Math.random() * 5) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
      });
    }

    await Order.insertMany(orders);

    res.json({ message: 'Dummy data seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// app.get("/admin-dashboard", auth, role("admin"), controller.adminDashboard);

const customerRoutes = require("./modules/customer/customer.routes");
app.use("/api/customer", customerRoutes);

const productRoutes = require("./modules/product/product.routes");
app.use("/api/products", productRoutes);

const aiRoutes = require("./modules/ai/ai.routes");
app.use("/api/ai", aiRoutes);

const adminRoutes = require("./modules/admin/admin.routes");
app.use("/api/admin", adminRoutes);

const designerRoutes = require("./modules/designer/designer.routes");
app.use("/api/designer", designerRoutes);

const manufacturerRoutes = require("./modules/manufacturer/manufacturer.routes");
app.use("/api/manufacturer", manufacturerRoutes);

 
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const errorHandler = require("./shared/middlewares/error.middleware");
app.use(errorHandler);
