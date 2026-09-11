function calculateRecommendationScore(user, company) {
  let score = 0;
  const reasons = [];
  const missingSkills = [];

  // ==============================
  // BRANCH MATCH — 25 points
  // ==============================
  const userBranch = (user.branch || "").trim().toLowerCase();

  const eligibleBranches = (
    company.eligibleBranches || []
  ).map((branch) => branch.trim().toLowerCase());

  if (
    eligibleBranches.length === 0 ||
    eligibleBranches.includes(userBranch)
  ) {
    score += 25;
    reasons.push("Your branch is eligible.");
  } else {
    reasons.push("Your branch is not listed as eligible.");
  }

  // ==============================
  // CGPA MATCH — 25 points
  // ==============================
  const userCGPA = Number(user.cgpa || 0);
  const minimumCGPA = Number(company.minimumCGPA || 0);

  if (userCGPA >= minimumCGPA) {
    score += 25;
    reasons.push("Your CGPA meets the company requirement.");
  } else {
    reasons.push(
      `CGPA requirement is ${minimumCGPA}. Your CGPA is ${userCGPA}.`
    );
  }

  // ==============================
  // SKILLS MATCH — 40 points
  // ==============================
  const userSkills = (user.skills || []).map((skill) =>
    skill.trim().toLowerCase()
  );

  const requiredSkills = (company.skillsRequired || []).map((skill) =>
    skill.trim().toLowerCase()
  );

  if (requiredSkills.length === 0) {
    score += 40;
    reasons.push("No specific technical skills are required.");
  } else {
    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.includes(skill)
    );

    missingSkills.push(
      ...requiredSkills.filter(
        (skill) => !userSkills.includes(skill)
      )
    );

    const skillScore = Math.round(
      (matchedSkills.length / requiredSkills.length) * 40
    );

    score += skillScore;

    if (matchedSkills.length > 0) {
      reasons.push(
        `Matched skills: ${matchedSkills.join(", ")}.`
      );
    }

    if (missingSkills.length > 0) {
      reasons.push(
        `Missing skills: ${missingSkills.join(", ")}.`
      );
    }
  }

  // ==============================
  // RESUME — 10 points
  // ==============================
  if (user.resume?.fileName || user.resume?.filePath) {
    score += 10;
    reasons.push("Resume is uploaded.");
  } else {
    reasons.push("Resume is not uploaded.");
  }

  // ==============================
  // FINAL SCORE
  // ==============================
  if (score > 100) {
    score = 100;
  }

  // ==============================
  // RECOMMENDATION
  // ==============================
  let recommendation;

  if (score >= 85) {
    recommendation = "Excellent match";
  } else if (score >= 70) {
    recommendation = "Strong match";
  } else if (score >= 50) {
    recommendation = "Moderate match";
  } else {
    recommendation = "Low match";
  }

  return {
    score,
    recommendation,
    reasons,
    missingSkills,
  };
}

module.exports = calculateRecommendationScore;