function calculateEligibility(user, company) {
  let score = 100;
  let results = [];

  // Branch Check
  if (
    company.eligibleBranches &&
    company.eligibleBranches.length > 0 &&
    !company.eligibleBranches.includes(user.branch)
  ) {
    score -= 30;
    results.push({
      status: "❌",
      message: "Branch not eligible",
    });
  } else {
    results.push({
      status: "✅",
      message: "Branch eligible",
    });
  }

  // CGPA Check
  if ((user.cgpa || 0) < (company.minimumCGPA || 0)) {
    score -= 25;
    results.push({
      status: "❌",
      message: `Minimum CGPA required: ${company.minimumCGPA}`,
    });
  } else {
    results.push({
      status: "✅",
      message: "CGPA eligible",
    });
  }

  // Skills Check
  const userSkills = (user.skills || []).map((skill) =>
    skill.toLowerCase()
  );

  const requiredSkills = company.skillsRequired || [];

  const missingSkills = requiredSkills.filter(
    (skill) => !userSkills.includes(skill.toLowerCase())
  );

  if (missingSkills.length > 0) {
    score -= missingSkills.length * 10;

    results.push({
      status: "⚠",
      message: `Missing Skills: ${missingSkills.join(", ")}`,
    });
  } else {
    results.push({
      status: "✅",
      message: "All required skills available",
    });
  }

  // Resume Check
  if (
    !user.resume ||
    !user.resume.filePath
  ) {
    score -= 15;

    results.push({
      status: "⚠",
      message: "Resume not uploaded",
    });
  } else {
    results.push({
      status: "✅",
      message: "Resume uploaded",
    });
  }

  if (score < 0) score = 0;

  let recommendation = "";

  if (score >= 85) {
    recommendation =
      "Excellent match. Apply immediately.";
  } else if (score >= 70) {
    recommendation =
      "Good match. Improve a few skills before applying.";
  } else if (score >= 50) {
    recommendation =
      "Moderate match. Consider improving your profile.";
  } else {
    recommendation =
      "Low eligibility. Focus on skills and CGPA before applying.";
  }

  return {
    score,
    results,
    recommendation,
  };
}

module.exports = calculateEligibility;