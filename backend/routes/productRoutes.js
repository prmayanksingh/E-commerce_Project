const express = require("express");
const Product = require("../models/Product");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");

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
    // Calculate average rating
    const reviews = await Review.find({ productId: req.params.id });
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : null;
    res.status(200).json({ ...product.toObject(), avgRating });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching product" });
  }
});

// Get all reviews for a product
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id })
      .populate({ path: "userId", select: "name" })
      .sort({ updatedAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Create or update a review for a product (buyer only, one per user per product)
router.post('/:id/review', authenticate, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating (1-5) is required' });
    }
    // Upsert review (one per user per product)
    const review = await Review.findOneAndUpdate(
      { productId: req.params.id, userId: req.user.id },
      { rating, feedback, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const populated = await review.populate({ path: 'userId', select: 'name' });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Edit own review
router.put("/review/:reviewId", authenticate, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const review = await Review.findOne({ _id: req.params.reviewId, userId: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (rating) review.rating = rating;
    if (feedback !== undefined) review.feedback = feedback;
    review.updatedAt = new Date();
    await review.save();
    const populated = await review.populate({ path: "userId", select: "name" });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error editing review" });
  }
});

// Delete own review
router.delete("/review/:reviewId", authenticate, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.reviewId, userId: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports = router;
