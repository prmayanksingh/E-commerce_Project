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

// DELETE /api/products/:id - Delete a product by ID (only by the seller)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId.toString() !== req.user.id && product.sellerId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting product" });
  }
});

// PUT /api/products/:id - Update a product by ID (only by the seller)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId.toString() !== req.user.id && product.sellerId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }
    const { name, description, price, stock, category, imageURL } = req.body;
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.category = category;
    product.imageURL = imageURL;
    await product.save();
    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating product" });
  }
});

// GET /api/products/all - Get all products (public, for buyers)
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({}).populate("sellerId", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching all products" });
  }
});

// GET /api/products/:id - Get single product by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sellerId", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching product" });
  }
});

module.exports = router;
