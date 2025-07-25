const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UnblockRequest = require("../models/UnblockRequest");

const registerController = async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Set a default role if not provided
    const userRole = role || "buyer";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked by the admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "JWT secret not configured on server" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.stack || error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Blocked user sends unblock request message to admin
const createUnblockRequest = async (req, res) => {
  try {
    let user;
    if (req.user) {
      user = await User.findById(req.user.id);
    } else if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    }
    const { message } = req.body;
    if (!user || !user.isBlocked) {
      return res.status(403).json({ message: "Only blocked users can send unblock requests." });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }
    const unblockRequest = new UnblockRequest({
      user: user._id,
      message,
    });
    await unblockRequest.save();
    res.status(201).json({ message: "Unblock request sent successfully." });
  } catch (error) {
    console.error("Error creating unblock request:", error);
    res.status(500).json({ message: "Server error while sending unblock request." });
  }
};

module.exports = {
  registerController,
  loginController,
  createUnblockRequest,
};
