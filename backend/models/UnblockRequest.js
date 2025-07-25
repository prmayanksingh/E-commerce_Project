const mongoose = require("mongoose");

const unblockRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const UnblockRequest = mongoose.model("UnblockRequest", unblockRequestSchema);

module.exports = UnblockRequest; 