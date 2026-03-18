// Global user schema (for all roles)
const { Schema, model } = require("mongoose");

const addressSchema = new Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
});

const designerSchema = new Schema({
  storeName: { type: String, required: true },
  designSpecifications: [{ type: String }],
  portfolio: [{ 
    title: String, 
    url: String, 
    published: { type: Boolean, default: false } 
  }],
});

const manufacturerSchema = new Schema({
  businessName: { type: String, required: true },
  ntn: { type: String, required: true },
  businessAddress: { type: addressSchema, required: true },
  productionTypes: [{ type: String, required: true }],
});

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  cnic: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: addressSchema, required: true },
  role: { type: String, required: true, enum: ["customer", "designer", "manufacturer", "admin"] },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  twoFactorSecret: {
    base32: String,
    otpauth_url: String
  },
  isTwoFactorEnabled: { type: Boolean, default: false },
  designerInfo: { type: designerSchema },
  manufacturerInfo: { type: manufacturerSchema },

  // NEW FIELDS
  isFirstLogin: { type: Boolean, default: true },
  personalization: { type: Object }
}, { timestamps: true });

module.exports = model("User", userSchema);
