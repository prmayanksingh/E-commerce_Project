const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");

// Create order
router.post("/", authenticate, async (req, res) => {
  try {
    const { products, totalAmount, fromCart } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    // Decrement stock for each product
    for (const item of products) {
      const productDoc = await Product.findById(item.product);
      if (!productDoc) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (productDoc.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${productDoc.name}` });
      }
      productDoc.stock -= item.quantity;
      await productDoc.save();
      // Add out-of-stock notification if stock reaches 0
      if (productDoc.stock === 0) {
        const seller = await User.findById(productDoc.sellerId);
        const alreadyNotified = seller.notifications.some(n => n.productId && n.productId.toString() === productDoc._id.toString());
        if (!alreadyNotified) {
          seller.notifications.push({
            message: `Product '${productDoc.name}' is out of stock`,
            productId: productDoc._id,
            productName: productDoc.name,
            productImage: productDoc.imageURL,
          });
          await seller.save();
          console.log(`[NOTIF] Out of stock notification created for product '${productDoc.name}' on order.`);
        }
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount,
    });

    // If checkout is from cart, remove only the purchased items from the cart
    if (fromCart) {
      const purchasedIds = products.map(p => p.product);
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { products: { product: { $in: purchasedIds } } } }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// Get current user's orders
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: "products.product",
        populate: { path: "sellerId", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Cancel order
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Increment stock for each product in the cancelled order
    for (const item of order.products) {
      const productDoc = await Product.findById(item.product);
      if (productDoc) {
        productDoc.stock += item.quantity;
        await productDoc.save();
      }
    }

    await Order.deleteOne({ _id: order._id });

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

module.exports = router;
