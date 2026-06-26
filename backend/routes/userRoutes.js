const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware"); // must be function

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "This is protected data",
    userId: req.user,
  });
});

module.exports = router;