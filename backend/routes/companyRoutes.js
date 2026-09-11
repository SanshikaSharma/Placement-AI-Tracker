const express = require("express");

const router = express.Router();

const {
  addCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================
// COMPANY ROUTES
// ======================================

// --------------------------------------
// STUDENT + ADMIN
// View companies
// --------------------------------------
router.get(
  "/",
  authMiddleware,
  getCompanies
);

// --------------------------------------
// STUDENT + ADMIN
// View single company
// --------------------------------------
router.get(
  "/:id",
  authMiddleware,
  getCompanyById
);

// --------------------------------------
// ADMIN ONLY
// Add company
// --------------------------------------
router.post(
  "/",
  adminMiddleware,
  addCompany
);

// --------------------------------------
// ADMIN ONLY
// Update company
// --------------------------------------
router.put(
  "/:id",
  adminMiddleware,
  updateCompany
);

// --------------------------------------
// ADMIN ONLY
// Delete company
// --------------------------------------
router.delete(
  "/:id",
  adminMiddleware,
  deleteCompany
);

module.exports = router;