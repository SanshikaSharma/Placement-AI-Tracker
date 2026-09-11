const mongoose = require("mongoose");
const Company = require("../models/Company");

// ======================================
// HELPER FUNCTIONS
// ======================================

const escapeRegex = (value = "") => {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================
// ADD COMPANY
// ADMIN ONLY
// ======================================
const addCompany = async (req, res) => {
  try {
    const {
      companyName,
      role,
      package: packageValue,
      location,
      jobType,
      eligibleBranches,
      minimumCGPA,
      skillsRequired,
      eligibility,
      description,
      applyLink,
      deadline,
      status,
    } = req.body;

    // ------------------------------
    // Required field validation
    // ------------------------------
    if (
      typeof companyName !== "string" ||
      !companyName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    if (
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (
      typeof packageValue !== "string" ||
      !packageValue.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Package is required",
      });
    }

    if (
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    if (
      typeof eligibility !== "string" ||
      !eligibility.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Eligibility is required",
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: "Deadline is required",
      });
    }

    // ------------------------------
    // CGPA validation
    // ------------------------------
    const cgpa = Number(minimumCGPA ?? 0);

    if (
      Number.isNaN(cgpa) ||
      cgpa < 0 ||
      cgpa > 10
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum CGPA must be between 0 and 10",
      });
    }

    // ------------------------------
    // Array validation
    // ------------------------------
    if (
      eligibleBranches !== undefined &&
      !Array.isArray(eligibleBranches)
    ) {
      return res.status(400).json({
        success: false,
        message: "Eligible branches must be an array",
      });
    }

    if (
      skillsRequired !== undefined &&
      !Array.isArray(skillsRequired)
    ) {
      return res.status(400).json({
        success: false,
        message: "Skills required must be an array",
      });
    }

    // ------------------------------
    // Deadline validation
    // ------------------------------
    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid deadline",
      });
    }

    // ------------------------------
    // Status validation
    // ------------------------------
    const allowedStatuses = [
      "Open",
      "Closed",
    ];

    const companyStatus =
      status || "Open";

    if (!allowedStatuses.includes(companyStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company status",
      });
    }

    // ------------------------------
    // Create company
    // ------------------------------
    const company = await Company.create({
      companyName: companyName.trim(),
      role: role.trim(),
      package: packageValue.trim(),
      location: location.trim(),
      jobType:
        typeof jobType === "string" &&
        jobType.trim()
          ? jobType.trim()
          : "Full Time",

      eligibleBranches: Array.isArray(
        eligibleBranches
      )
        ? eligibleBranches
            .filter(
              (item) =>
                typeof item === "string"
            )
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      minimumCGPA: cgpa,

      skillsRequired: Array.isArray(
        skillsRequired
      )
        ? skillsRequired
            .filter(
              (item) =>
                typeof item === "string"
            )
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      eligibility: eligibility.trim(),

      description:
        typeof description === "string"
          ? description.trim()
          : "",

      applyLink:
        typeof applyLink === "string"
          ? applyLink.trim()
          : "",

      deadline: deadlineDate,

      status: companyStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Company added successfully",
      company,
    });
  } catch (error) {
    console.error(
      "Add Company Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to add company",
    });
  }
};

// ======================================
// GET ALL COMPANIES
// STUDENT + ADMIN
// ======================================
const getCompanies = async (req, res) => {
  try {
    const {
      search = "",
      branch,
      cgpa,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    // ------------------------------
    // Pagination validation
    // ------------------------------
    const currentPage = Math.max(
      1,
      Number.parseInt(page, 10) || 1
    );

    const pageLimit = Math.min(
      50,
      Math.max(
        1,
        Number.parseInt(limit, 10) || 10
      )
    );

    const filter = {};

    // ------------------------------
    // Search
    // ------------------------------
    if (
      typeof search === "string" &&
      search.trim()
    ) {
      const safeSearch =
        escapeRegex(search.trim());

      filter.$or = [
        {
          companyName: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          role: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          location: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // ------------------------------
    // Branch filter
    // ------------------------------
    if (
      typeof branch === "string" &&
      branch.trim()
    ) {
      filter.eligibleBranches = {
        $in: [branch.trim()],
      };
    }

    // ------------------------------
    // CGPA filter
    // ------------------------------
    if (
      cgpa !== undefined &&
      cgpa !== ""
    ) {
      const cgpaNumber = Number(cgpa);

      if (
        Number.isNaN(cgpaNumber) ||
        cgpaNumber < 0 ||
        cgpaNumber > 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid CGPA filter",
        });
      }

      filter.minimumCGPA = {
        $lte: cgpaNumber,
      };
    }

    // ------------------------------
    // Status filter
    // ------------------------------
    if (
      typeof status === "string" &&
      status.trim()
    ) {
      const allowedStatuses = [
        "Open",
        "Closed",
      ];

      if (
        !allowedStatuses.includes(
          status.trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status filter",
        });
      }

      filter.status = status.trim();
    }

    // ------------------------------
    // Count
    // ------------------------------
    const total =
      await Company.countDocuments(
        filter
      );

    // ------------------------------
    // Get companies
    // ------------------------------
    const companies =
      await Company.find(filter)
        .sort({ createdAt: -1 })
        .skip(
          (currentPage - 1) *
            pageLimit
        )
        .limit(pageLimit);

    return res.status(200).json({
      success: true,
      total,
      currentPage,
      totalPages:
        Math.ceil(
          total / pageLimit
        ),
      companies,
    });
  } catch (error) {
    console.error(
      "Get Companies Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch companies",
    });
  }
};

// ======================================
// GET SINGLE COMPANY
// STUDENT + ADMIN
// ======================================
const getCompanyById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company =
      await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(
      "Get Company Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch company",
    });
  }
};

// ======================================
// UPDATE COMPANY
// ADMIN ONLY
// ======================================
const updateCompany = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company =
      await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ----------------------------------
    // Only these fields can be updated
    // ----------------------------------
    const allowedFields = [
      "companyName",
      "role",
      "package",
      "location",
      "jobType",
      "eligibleBranches",
      "minimumCGPA",
      "skillsRequired",
      "eligibility",
      "description",
      "applyLink",
      "deadline",
      "status",
    ];

    const incomingFields =
      Object.keys(req.body || {});

    const invalidFields =
      incomingFields.filter(
        (field) =>
          !allowedFields.includes(field)
      );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid field(s): " +
          invalidFields.join(", "),
      });
    }

    // ----------------------------------
    // String fields
    // ----------------------------------
    const stringFields = [
      "companyName",
      "role",
      "package",
      "location",
      "jobType",
      "eligibility",
      "description",
      "applyLink",
    ];

    for (const field of stringFields) {
      if (
        req.body[field] !== undefined
      ) {
        if (
          typeof req.body[field] !==
          "string"
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${field} must be a string`,
          });
        }

        company[field] =
          req.body[field].trim();
      }
    }

    // ----------------------------------
    // Arrays
    // ----------------------------------
    if (
      req.body.eligibleBranches !==
      undefined
    ) {
      if (
        !Array.isArray(
          req.body.eligibleBranches
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Eligible branches must be an array",
        });
      }

      company.eligibleBranches =
        req.body.eligibleBranches
          .filter(
            (item) =>
              typeof item ===
              "string"
          )
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
    }

    if (
      req.body.skillsRequired !==
      undefined
    ) {
      if (
        !Array.isArray(
          req.body.skillsRequired
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Skills required must be an array",
        });
      }

      company.skillsRequired =
        req.body.skillsRequired
          .filter(
            (item) =>
              typeof item ===
              "string"
          )
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
    }

    // ----------------------------------
    // CGPA
    // ----------------------------------
    if (
      req.body.minimumCGPA !==
      undefined
    ) {
      const cgpa = Number(
        req.body.minimumCGPA
      );

      if (
        Number.isNaN(cgpa) ||
        cgpa < 0 ||
        cgpa > 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Minimum CGPA must be between 0 and 10",
        });
      }

      company.minimumCGPA = cgpa;
    }

    // ----------------------------------
    // Deadline
    // ----------------------------------
    if (
      req.body.deadline !==
      undefined
    ) {
      const deadline =
        new Date(
          req.body.deadline
        );

      if (
        Number.isNaN(
          deadline.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid deadline",
        });
      }

      company.deadline = deadline;
    }

    // ----------------------------------
    // Status
    // ----------------------------------
    if (
      req.body.status !== undefined
    ) {
      const allowedStatuses = [
        "Open",
        "Closed",
      ];

      if (
        !allowedStatuses.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid company status",
        });
      }

      company.status =
        req.body.status;
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message:
        "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error(
      "Update Company Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update company",
    });
  }
};

// ======================================
// DELETE COMPANY
// ADMIN ONLY
// ======================================
const deleteCompany = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company =
      await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await Company.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Company deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Company Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete company",
    });
  }
};

module.exports = {
  addCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};