const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing data.");

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const genericPassword = await bcrypt.hash("password123", 10);

    const address = { country: "US", city: "New York", address: "123 Main St" };

    // 1. Create Admin
    await User.create({
      fullName: "System Admin",
      email: "admin@orli.com",
      password: hashedPassword,
      phone: "+1234567890",
      cnic: "00000-0000000-0",
      dob: "1980-01-01",
      address,
      role: "admin",
      isVerified: true,
      isFirstLogin: false
    });

    // 2. Create Manufacturer
    const manufacturer = await User.create({
      fullName: "Orli Manufacturer",
      email: "manufacturer@orli.com",
      password: genericPassword,
      phone: "+1987654321",
      cnic: "11111-1111111-1",
      dob: "1990-01-01",
      address,
      role: "manufacturer",
      isVerified: true,
      isFirstLogin: false,
      manufacturerInfo: {
        businessName: "Orli Garments",
        ntn: "1234567-8",
        businessAddress: address,
        productionTypes: ["T-Shirts", "Hoodies", "Mugs"]
      }
    });

    // 3. Create Designer
    const designer = await User.create({
      fullName: "Avery Designs",
      email: "designer@orli.com",
      password: genericPassword,
      phone: "+1122334455",
      cnic: "22222-2222222-2",
      dob: "1995-05-05",
      address,
      role: "designer",
      isVerified: true,
      isFirstLogin: false,
      designerInfo: {
        storeName: "Avery's Art House",
        designSpecifications: ["Vector SVG", "PNG"],
        portfolio: [
          { title: "Neon Cyber Kitty", url: "https://via.placeholder.com/300?text=Neon+Kitty", published: true },
          { title: "Retro Wave Sun", url: "https://via.placeholder.com/300?text=Retro+Sun", published: false }
        ]
      }
    });

    // 4. Create Customer
    const customer = await User.create({
      fullName: "Jane Doe Customer",
      email: "customer@orli.com",
      password: genericPassword,
      phone: "+1555666777",
      cnic: "33333-3333333-3",
      dob: "1998-08-08",
      address,
      role: "customer",
      isVerified: true,
      isFirstLogin: false
    });

    // 5. Create Products with Metadata for recommendations
    const products = [
      {
        title: "Classic White Tee",
        description: "Premium cotton t-shirt perfect for custom printing.",
        images: ["https://via.placeholder.com/400?text=White+Tee"],
        tags: ["clothing", "blank", "unisex"],
        metadata: ["tshirt", "apparel", "summer", "casual", "cotton"],
        published: true,
        manufacturer: manufacturer._id,
        variants: [{ color: "White", size: "M", cost: 15.99, productionTime: 2, shippingTime: 3, inventory: 500 }]
      },
      {
        title: "Black Graphic Hoodie",
        description: "Heavyweight hoodie for winter.",
        images: ["https://via.placeholder.com/400?text=Black+Hoodie"],
        tags: ["clothing", "winter", "heavyweight"],
        metadata: ["hoodie", "apparel", "winter", "warm", "fleece"],
        published: true,
        manufacturer: manufacturer._id,
        variants: [{ color: "Black", size: "L", cost: 35.00, productionTime: 3, shippingTime: 3, inventory: 200 }]
      },
      {
        title: "Ceramic Coffee Mug",
        description: "11oz ceramic mug.",
        images: ["https://via.placeholder.com/400?text=Coffee+Mug"],
        tags: ["accessories", "drinkware", "customizable"],
        metadata: ["mug", "coffee", "ceramic", "drinkware", "home"],
        published: true,
        manufacturer: manufacturer._id,
        variants: [{ color: "White", size: "11oz", cost: 8.50, productionTime: 1, shippingTime: 2, inventory: 1000 }]
      }
    ];

    await Product.insertMany(products);
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
