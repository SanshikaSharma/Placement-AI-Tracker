const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Order = require("../models/Order");

// create order
router.post("/", protect, async (req, res) => {
  try {
    const { company, role } = req.body;

    const order = await Order.create({
      user: req.user,
      company,
      role,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get user orders
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user });
  res.json(orders);
});

module.exports = router;