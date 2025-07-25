const express = require("express");
const { registerController, loginController, createUnblockRequest } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();
 
router.post("/register", registerController);
router.post("/login", loginController);

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile!",
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});

router.post("/unblock-request", createUnblockRequest);

module.exports = router;
