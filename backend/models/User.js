const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "buyer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    notifications: [
      {
        message: String,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: String,
        productImage: String,
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;