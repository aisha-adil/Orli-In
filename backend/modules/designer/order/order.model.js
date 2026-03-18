const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    designer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "received",
        "accepted",
        "in_progress",
        "delivered",
        "completed",
        "rejected",
      ],
      default: "received",
    },

    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);