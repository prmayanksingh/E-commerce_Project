const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes")

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// Allows app to accept JSON data in requests (like when you send data from a form or frontend using POST)
app.use(express.json());

app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Sets the port on which server runs
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
