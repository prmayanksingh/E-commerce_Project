const express = require("express");
const Product = require("../models/Product");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/products - Add new product (protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, description, price, stock, category, imageURL } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Name, price, and stock are required" });
    }
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageURL,
      sellerId: req.user.id || req.user._id,
    });
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: "Server error while adding product" });
  }
});

// GET /api/products/my - Get all products by logged-in seller (protected)
router.get("/my", authenticate, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id || req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching products" });
  }
});

module.exports = router;
