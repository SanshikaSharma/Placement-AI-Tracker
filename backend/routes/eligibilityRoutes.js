const express = require("express");

const router = express.Router();

const {
  checkEligibility,
} = require("../controllers/eligibilityController");

const authMiddleware = require("../middleware/authMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

router.get(
  "/:studentId/:companyId",
  authMiddleware,
  studentOwnershipMiddleware,
  checkEligibility
);

module.exports = router;