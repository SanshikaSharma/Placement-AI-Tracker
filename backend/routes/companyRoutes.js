const express = require("express");

const router = express.Router();

const {
  addCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

// ==========================
// Company CRUD Routes
// ==========================

// Add Company
router.post("/", addCompany);

// Get All Companies
router.get("/", getCompanies);

// Get Company By ID
router.get("/:id", getCompanyById);

// Update Company
router.put("/:id", updateCompany);

// Delete Company
router.delete("/:id", deleteCompany);

module.exports = router;