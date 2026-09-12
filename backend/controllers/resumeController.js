const fs = require("fs");
const path = require("path");
const multer = require("multer");

const User = require("../models/User");

// =====================================================
// MULTER STORAGE
// =====================================================

const uploadDir = path.join(
  __dirname,
  "../uploads/resumes"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}` + extension;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (extension !== ".pdf") {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }

    cb(null, true);
  },
});

// =====================================================
// UPLOAD RESUME
// POST /api/resume/upload
// =====================================================

const uploadResume = async (req, res) => {
  try {
    upload.single("resume")(
      req,
      res,
      async (error) => {
        try {
          // ==========================================
          // MULTER ERROR
          // ==========================================

          if (error) {
            return res.status(400).json({
              success: false,
              message: error.message,
            });
          }

          // ==========================================
          // FILE CHECK
          // ==========================================

          if (!req.file) {
            return res.status(400).json({
              success: false,
              message: "Please upload a PDF resume",
            });
          }

          // ==========================================
          // GET STUDENT ID FROM JWT
          // ==========================================
          // IMPORTANT:
          // We trust the authenticated JWT instead
          // of taking the student ID from FormData.

          const userId = req.user?.id;

          if (!userId) {
            if (fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }

            return res.status(401).json({
              success: false,
              message: "Authentication required",
            });
          }

          // ==========================================
          // FIND USER
          // ==========================================

          const user = await User.findById(userId);

          if (!user) {
            if (fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          // ==========================================
          // DELETE PREVIOUS RESUME
          // ==========================================

          if (
            user.resume &&
            user.resume.filePath &&
            fs.existsSync(user.resume.filePath)
          ) {
            fs.unlinkSync(user.resume.filePath);
          }

          // ==========================================
          // SAVE NEW RESUME
          // ==========================================

          user.resume = {
            fileName: req.file.filename,

            originalName:
              req.file.originalname,

            filePath: req.file.path,

            uploadedAt: new Date(),
          };

          await user.save();

          // ==========================================
          // SUCCESS
          // ==========================================

          return res.status(200).json({
            success: true,

            message:
              "Resume uploaded successfully",

            resume: {
              fileName:
                user.resume.fileName,

              originalName:
                user.resume.originalName,

              uploadedAt:
                user.resume.uploadedAt,
            },
          });
        } catch (innerError) {
          console.error(
            "Resume Upload Error:",
            innerError.message
          );

          // Remove uploaded file if database
          // operation fails

          if (
            req.file &&
            fs.existsSync(req.file.path)
          ) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            success: false,
            message: innerError.message,
          });
        }
      }
    );
  } catch (error) {
    console.error(
      "Resume Upload Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET RESUME
// GET /api/resume/:userId
// =====================================================

const getResume = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !user.resume ||
      !user.resume.fileName
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded",
      });
    }

    return res.status(200).json({
      success: true,

      resume: {
        fileName:
          user.resume.fileName,

        originalName:
          user.resume.originalName,

        filePath:
          user.resume.filePath,

        uploadedAt:
          user.resume.uploadedAt,

        downloadUrl:
          `/api/resume/download/${user._id}`,
      },
    });
  } catch (error) {
    console.error(
      "Get Resume Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DOWNLOAD RESUME
// GET /api/resume/download/:userId
// =====================================================

const downloadResume = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !user.resume ||
      !user.resume.filePath
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded",
      });
    }

    if (
      !fs.existsSync(
        user.resume.filePath
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Resume file not found on server",
      });
    }

    return res.download(
      user.resume.filePath,
      user.resume.originalName ||
        user.resume.fileName
    );
  } catch (error) {
    console.error(
      "Download Resume Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE RESUME
// DELETE /api/resume/:userId
// =====================================================

const deleteResume = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !user.resume ||
      !user.resume.filePath
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded",
      });
    }

    // ==========================================
    // DELETE PHYSICAL FILE
    // ==========================================

    if (
      fs.existsSync(
        user.resume.filePath
      )
    ) {
      fs.unlinkSync(
        user.resume.filePath
      );
    }

    // ==========================================
    // REMOVE RESUME DATA
    // ==========================================

    user.resume = {
      fileName: "",
      originalName: "",
      filePath: "",
      uploadedAt: undefined,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Resume Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// AI RESUME ANALYSIS
// GET /api/resume/analyze/:studentId
// =====================================================

const analyzeResume = async (
  req,
  res
) => {
  try {
    const { studentId } = req.params;

    const user =
      await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==========================================
    // ATS SCORE
    // ==========================================

    let score = 0;

    const strengths = [];
    const weaknesses = [];
    const suggestions = [];
    const missingSkills = [];

    // ==========================================
    // 1. RESUME UPLOAD - 10
    // ==========================================

    if (user.resume?.fileName) {
      score += 10;

      strengths.push(
        "Resume Uploaded"
      );
    } else {
      weaknesses.push(
        "Resume not uploaded"
      );

      suggestions.push(
        "Upload your resume"
      );
    }

    // ==========================================
    // 2. BASIC PROFILE - 10
    // ==========================================

    let basicInfoScore = 0;

    if (user.name) {
      basicInfoScore += 2;
    }

    if (user.email) {
      basicInfoScore += 2;
    }

    if (user.phone) {
      basicInfoScore += 2;
    }

    if (user.college) {
      basicInfoScore += 2;
    }

    if (user.branch) {
      basicInfoScore += 2;
    }

    score += basicInfoScore;

    if (basicInfoScore >= 8) {
      strengths.push(
        "Complete Contact and Education Details"
      );
    } else {
      weaknesses.push(
        "Some basic profile information is missing"
      );

      suggestions.push(
        "Complete your contact and education details"
      );
    }

    // ==========================================
    // 3. TECHNICAL SKILLS - 20
    // ==========================================

    const skills = user.skills || [];

    if (skills.length >= 8) {
      score += 20;

      strengths.push(
        "Strong Technical Skills"
      );
    } else if (skills.length >= 5) {
      score += 15;

      strengths.push(
        "Good Technical Skills"
      );
    } else if (skills.length >= 3) {
      score += 10;

      weaknesses.push(
        "Technical skills can be improved"
      );

      suggestions.push(
        "Add more relevant technical skills"
      );
    } else if (skills.length > 0) {
      score += 5;

      weaknesses.push(
        "Very few technical skills"
      );

      suggestions.push(
        "Add more technical skills related to your target job"
      );
    } else {
      weaknesses.push(
        "Technical skills missing"
      );

      suggestions.push(
        "Add technical skills such as programming languages, frameworks and databases"
      );
    }

    // ==========================================
    // 4. PROJECTS - 20
    // ==========================================

    const projects =
      user.projects || [];

    if (projects.length >= 3) {
      score += 20;

      strengths.push(
        "Strong Project Portfolio"
      );
    } else if (projects.length === 2) {
      score += 15;

      strengths.push(
        "Good Project Experience"
      );
    } else if (projects.length === 1) {
      score += 10;

      weaknesses.push(
        "Project experience is limited"
      );

      suggestions.push(
        "Add at least one more strong project"
      );
    } else {
      weaknesses.push(
        "Projects missing"
      );

      suggestions.push(
        "Add 2-3 relevant projects with technologies and achievements"
      );
    }

    // ==========================================
    // 5. CERTIFICATIONS - 10
    // ==========================================

    const certifications =
      user.certifications || [];

    if (certifications.length >= 3) {
      score += 10;

      strengths.push(
        "Strong Certifications"
      );
    } else if (
      certifications.length >= 1
    ) {
      score += 7;

      strengths.push(
        "Certifications Added"
      );
    } else {
      weaknesses.push(
        "Certifications missing"
      );

      suggestions.push(
        "Add relevant certifications"
      );
    }

    // ==========================================
    // 6. GITHUB - 5
    // ==========================================

    if (user.github) {
      score += 5;

      strengths.push(
        "GitHub Profile"
      );
    } else {
      suggestions.push(
        "Add your GitHub profile"
      );
    }

    // ==========================================
    // 7. LINKEDIN - 5
    // ==========================================

    if (user.linkedin) {
      score += 5;

      strengths.push(
        "LinkedIn Profile"
      );
    } else {
      suggestions.push(
        "Add your LinkedIn profile"
      );
    }

    // ==========================================
    // 8. CGPA - 10
    // ==========================================

    if (user.cgpa >= 8.5) {
      score += 10;

      strengths.push(
        "Strong Academic Performance"
      );
    } else if (user.cgpa >= 7) {
      score += 8;

      strengths.push(
        "Good Academic Performance"
      );
    } else if (user.cgpa >= 6) {
      score += 5;
    } else if (user.cgpa > 0) {
      score += 3;

      weaknesses.push(
        "Academic score can be improved"
      );
    } else {
      suggestions.push(
        "Add your CGPA to your profile"
      );
    }

    // ==========================================
    // FINAL SCORE
    // ==========================================

    const atsScore = Math.min(
      Math.max(
        Math.round(score),
        0
      ),
      100
    );

    // ==========================================
    // COMMON MISSING SKILLS
    // ==========================================

    const commonSkills = [
      "React",
      "Node.js",
      "MongoDB",
      "JavaScript",
      "Git",
      "Express.js",
    ];

    const existingSkills =
      skills.map((skill) =>
        skill.toLowerCase()
      );

    commonSkills.forEach(
      (skill) => {
        if (
          !existingSkills.includes(
            skill.toLowerCase()
          )
        ) {
          missingSkills.push(
            skill
          );
        }
      }
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      score: atsScore,

      resumeScore: atsScore,

      atsScore,

      strengths,

      weaknesses,

      suggestions,

      missingSkills:
        missingSkills.slice(0, 5),
    });
  } catch (error) {
    console.error(
      "Resume Analysis Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
  analyzeResume,
};