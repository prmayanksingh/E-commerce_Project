const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Confirmed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
