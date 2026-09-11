const express = require("express");

const router = express.Router();

const {
  getAllProfiles,
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

// All profiles → Admin only
router.get(
  "/all",
  adminMiddleware,
  getAllProfiles
);

// Own profile
router.get(
  "/:id",
  authMiddleware,
  studentOwnershipMiddleware,
  getProfile
);

// Update own profile
router.put(
  "/:id",
  authMiddleware,
  studentOwnershipMiddleware,
  updateProfile
);

module.exports = router;