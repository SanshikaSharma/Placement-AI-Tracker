const express = require("express");

const router = express.Router();

const {
  checkEligibility,
} = require("../controllers/eligibilityController");

// GET AI Eligibility
router.get(
  "/:studentId/:companyId",
  checkEligibility
);

module.exports = router;