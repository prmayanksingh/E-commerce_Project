const express = require("express");
const Cart = require("../models/Cart");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Get current user's cart
router.get("/", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: "products.product",
        populate: { path: "sellerId", select: "name" }
      });
    if (!cart) cart = await Cart.create({ userId: req.user.id, products: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Add product to cart
router.post("/add", authenticate, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, products: [] });
    const exists = cart.products.find(
      (p) => p.product && p.product.toString() === productId
    );
    if (!exists) {
      cart.products.push({ product: productId, quantity: 1 });
      await cart.save();
    }
    cart = await cart.populate({
      path: "products.product",
      populate: { path: "sellerId", select: "name" }
    });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// Remove product from cart
router.post("/remove", authenticate, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    console.log("[Cart Remove] productId:", productId);
    if (cart) {
      if (!Array.isArray(cart.products)) cart.products = [];
      console.log("[Cart Remove] Cart before:", cart.products);
      cart.products.forEach((p, idx) => {
        console.log(`[Cart Remove] Product[${idx}]:`, p);
      });
      cart.products = cart.products.filter((p) => {
        if (!p.product) return true; // keep if no product ref
        try {
          return p.product.toString() !== productId;
        } catch (e) {
          console.error("[Cart Remove] Error converting product to string:", e);
          return true;
        }
      });
      await cart.save();
      cart = await cart.populate({
        path: "products.product",
        populate: { path: "sellerId", select: "name" }
      });
      console.log("[Cart Remove] Cart after:", cart.products);
    } else {
      // If no cart exists, create an empty one
      cart = await Cart.create({ userId: req.user.id, products: [] });
      console.log("[Cart Remove] No cart found, created new empty cart.");
    }
    res.json(cart);
  } catch (err) {
    console.error("Error removing from cart (outer catch):", err);
    res.status(500).json({ message: "Error removing from cart" });
  }
});

module.exports = router;
