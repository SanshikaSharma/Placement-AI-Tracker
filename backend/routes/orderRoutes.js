const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const Order = require("../models/Order");

// Create Order
router.post("/", protect, async (req, res) => {
  try {
    const { company, role } = req.body;

    const order = await Order.create({
      user: req.user,
      company,
      role,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get User Orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.put("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!order) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;