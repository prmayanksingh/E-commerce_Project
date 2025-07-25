const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const UnblockRequest = require('../models/UnblockRequest');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (buyers and sellers)
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['buyer', 'seller'] } }, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Block a user
router.patch('/users/:id/block', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unblock a user
router.patch('/users/:id/unblock', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products with reviews and ratings
router.get('/products', authenticate, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name').lean();
    const productIds = products.map(p => p._id);
    const reviews = await Review.find({ productId: { $in: productIds } });
    // Attach reviews to products
    const productsWithReviews = products.map(product => ({
      ...product,
      reviews: reviews.filter(r => r.productId.toString() === product._id.toString())
    }));
    res.json(productsWithReviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin fetches all unblock requests
router.get('/unblock-requests', authenticate, isAdmin, async (req, res) => {
  try {
    const requests = await UnblockRequest.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin resolves an unblock request
router.patch('/unblock-requests/:id/resolve', authenticate, isAdmin, async (req, res) => {
  try {
    const request = await UnblockRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request marked as resolved', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin clears all unblock requests
router.delete('/unblock-requests/clear', authenticate, isAdmin, async (req, res) => {
  try {
    await UnblockRequest.deleteMany({});
    res.json({ message: 'All unblock requests cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 