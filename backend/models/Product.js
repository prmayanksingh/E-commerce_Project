const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: String,
  imageURL: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
