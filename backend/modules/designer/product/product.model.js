const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    designer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    tags: [String],

    images: [String], // URLs for now

    stock: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    // For analytics later
    totalSales: {
      type: Number,
      default: 0,
    },

    totalRevenue: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    seoTitle: String,
    seoDescription: String,
    seoTags: [String],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
