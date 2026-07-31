const Company = require("../models/Company");

// ==========================
// ADD COMPANY
// ==========================
const addCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: "Company Added Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET ALL COMPANIES
// ==========================
const getCompanies = async (req, res) => {
  try {
    const {
      search,
      branch,
      cgpa,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search) {
      filter.companyName = {
        $regex: search,
        $options: "i",
      };
    }

    if (branch) {
      filter.eligibleBranches = branch;
    }

    if (cgpa) {
      filter.minimumCGPA = {
        $lte: Number(cgpa),
      };
    }

    if (status) {
      filter.status = status;
    }

    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Company.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET COMPANY BY ID
// ==========================
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found",
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE COMPANY
// ==========================
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found",
      });
    }

    res.json({
      success: true,
      message: "Company Updated Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// DELETE COMPANY
// ==========================
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found",
      });
    }

    res.json({
      success: true,
      message: "Company Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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