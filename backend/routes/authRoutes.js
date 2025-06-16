const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile!",
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});

module.exports = router;
