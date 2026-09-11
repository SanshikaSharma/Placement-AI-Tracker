// ==========================================
// AI ELIGIBILITY CALCULATOR
// ==========================================

function calculateEligibility(user, company) {
  let score = 100;

  const results = [];
  const missingSkills = [];

  // ==========================================
  // 1. BRANCH CHECK
  // ==========================================

  const eligibleBranches = Array.isArray(company.eligibleBranches)
    ? company.eligibleBranches
    : [];

  if (eligibleBranches.length > 0) {
    const userBranch = String(user.branch || "")
      .trim()
      .toLowerCase();

    const branchEligible = eligibleBranches.some(
      (branch) =>
        String(branch).trim().toLowerCase() === userBranch
    );

    if (!branchEligible) {
      score -= 30;

      results.push({
        status: "❌",
        type: "branch",
        message: "Your branch is not eligible for this company.",
      });
    } else {
      results.push({
        status: "✅",
        type: "branch",
        message: "Your branch is eligible.",
      });
    }
  } else {
    results.push({
      status: "✅",
      type: "branch",
      message: "No specific branch restriction.",
    });
  }

  // ==========================================
  // 2. CGPA CHECK
  // ==========================================

  const userCGPA = Number(user.cgpa || 0);
  const minimumCGPA = Number(company.minimumCGPA || 0);

  if (userCGPA < minimumCGPA) {
    score -= 25;

    results.push({
      status: "❌",
      type: "cgpa",
      message: `Minimum CGPA required: ${minimumCGPA}. Your CGPA: ${userCGPA}.`,
    });
  } else {
    results.push({
      status: "✅",
      type: "cgpa",
      message: `CGPA eligible. Your CGPA: ${userCGPA}.`,
    });
  }

  // ==========================================
  // 3. SKILLS CHECK
  // ==========================================

  const userSkills = Array.isArray(user.skills)
    ? user.skills
    : [];

  const requiredSkills = Array.isArray(company.skillsRequired)
    ? company.skillsRequired
    : [];

  const normalizedUserSkills = userSkills.map((skill) =>
    String(skill).trim().toLowerCase()
  );

  requiredSkills.forEach((skill) => {
    const normalizedSkill = String(skill)
      .trim()
      .toLowerCase();

    if (!normalizedUserSkills.includes(normalizedSkill)) {
      missingSkills.push(skill);
    }
  });

  if (missingSkills.length > 0) {
    // Maximum skill penalty = 30
    const skillPenalty = Math.min(
      missingSkills.length * 10,
      30
    );

    score -= skillPenalty;

    results.push({
      status: "⚠️",
      type: "skills",
      message: `Missing skills: ${missingSkills.join(", ")}`,
    });
  } else {
    results.push({
      status: "✅",
      type: "skills",
      message: "All required skills are available.",
    });
  }

  // ==========================================
  // 4. RESUME CHECK
  // ==========================================

  if (!user.resume || !user.resume.filePath) {
    score -= 15;

    results.push({
      status: "⚠️",
      type: "resume",
      message: "Resume has not been uploaded.",
    });
  } else {
    results.push({
      status: "✅",
      type: "resume",
      message: "Resume uploaded.",
    });
  }

  // ==========================================
  // 5. KEEP SCORE BETWEEN 0 AND 100
  // ==========================================

  score = Math.max(0, Math.min(score, 100));

  // ==========================================
  // 6. ELIGIBILITY STATUS
  // ==========================================

  let eligibilityStatus = "";

  if (score >= 85) {
    eligibilityStatus = "Highly Eligible";
  } else if (score >= 70) {
    eligibilityStatus = "Eligible";
  } else if (score >= 50) {
    eligibilityStatus = "Partially Eligible";
  } else {
    eligibilityStatus = "Not Eligible";
  }

  // ==========================================
  // 7. RECOMMENDATION
  // ==========================================

  let recommendation = "";

  if (score >= 85) {
    recommendation =
      "Excellent match. You should apply immediately.";
  } else if (score >= 70) {
    recommendation =
      "Good match. You are eligible, but improving a few areas will strengthen your profile.";
  } else if (score >= 50) {
    recommendation =
      "Moderate match. Improve your skills, CGPA, or profile before applying.";
  } else {
    recommendation =
      "Low eligibility. Focus on improving your profile before applying.";
  }

  // ==========================================
  // FINAL RESULT
  // ==========================================

  return {
    score,
    eligibilityStatus,
    missingSkills,
    results,
    recommendation,
  };
}

module.exports = calculateEligibility;