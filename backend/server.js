const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Allows app to accept JSON data in requests (like when you send data from a form or frontend using POST)
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);


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
