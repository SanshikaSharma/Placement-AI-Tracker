const skills = require("./skillDatabase");

const cleanLine = (line) => {
  return line
    .replace(/^[•●▪◦*-]\s*/, "")
    .replace(/^\d+[\.\)]\s*/, "")
    .trim();
};

const getSection = (text, sectionNames) => {
  const lines = text.split("\n");
  const startIndex = lines.findIndex((line) => {
    const lower = line.trim().toLowerCase();
    return sectionNames.some((name) => lower === name);
  });

  if (startIndex === -1) return [];

  const result = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    const lower = line.toLowerCase();

    const isNextSection = [
      "education",
      "skills",
      "technical skills",
      "projects",
      "project",
      "certifications",
      "certificates",
      "experience",
      "work experience",
      "internship",
      "achievements",
      "contact",
      "summary",
      "profile",
      "objective",
    ].includes(lower);

    if (isNextSection) break;

    result.push(cleanLine(line));
  }

  return result;
};

const extractProjects = (text) => {
  const lines = getSection(text, ["projects", "project"]);

  if (!lines.length) return [];

  const projects = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      line.length > 2 &&
      !line.toLowerCase().startsWith("technologies") &&
      !line.toLowerCase().startsWith("technology") &&
      !line.toLowerCase().startsWith("description")
    ) {
      projects.push(line);
    }
  }

  return [...new Set(projects)].slice(0, 10);
};

const extractCertifications = (text) => {
  const lines = getSection(text, [
    "certifications",
    "certification",
    "certificates",
    "certificate",
  ]);

  if (!lines.length) return [];

  return [...new Set(lines)]
    .filter((line) => line.length > 2)
    .slice(0, 10);
};

const extractPhone = (text) => {
  const match = text.match(
    /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/
  );

  return match ? match[0].trim() : "";
};

const extractEmail = (text) => {
  const match = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

  return match ? match[0].trim() : "";
};

const extractLinkedIn = (text) => {
  const match = text.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i
  );

  return match ? match[0].trim() : "";
};

const extractGitHub = (text) => {
  const match = text.match(
    /https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i
  );

  return match ? match[0].trim() : "";
};

const extractCgpa = (text) => {
  const match = text.match(
    /(?:cgpa|c\.g\.p\.a|grade point average)\s*[:\-]?\s*(\d+(?:\.\d+)?)/i
  );

  if (!match) return 0;

  const value = Number(match[1]);

  return value >= 0 && value <= 10 ? value : 0;
};

const extractName = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 8)) {
    if (
      line.length >= 3 &&
      line.length <= 50 &&
      /^[A-Za-z .'-]+$/.test(line) &&
      !line.includes("@") &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("curriculum")
    ) {
      return line;
    }
  }

  return "";
};

const extractLocation = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 12)) {
    const lower = line.toLowerCase();

    if (
      lower.includes("hamirpur") ||
      lower.includes("chandigarh") ||
      lower.includes("delhi") ||
      lower.includes("punjab") ||
      lower.includes("haryana") ||
      lower.includes("himachal") ||
      lower.includes("uttar pradesh")
    ) {
      return line;
    }
  }

  return "";
};

const analyzeResume = (resumeText) => {
  const text = resumeText || "";
  const lowerText = text.toLowerCase();

  // -----------------------------
  // SKILLS
  // -----------------------------

  const foundSkills = skills.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  );

  const missingSkills = skills.filter(
    (skill) => !foundSkills.includes(skill)
  );

  // -----------------------------
  // PROFILE EXTRACTION
  // -----------------------------

  const phone = extractPhone(text);
  const email = extractEmail(text);
  const linkedin = extractLinkedIn(text);
  const github = extractGitHub(text);
  const cgpa = extractCgpa(text);
  const name = extractName(text);
  const address = extractLocation(text);

  const projects = extractProjects(text);
  const certifications = extractCertifications(text);

  // -----------------------------
  // ATS SCORE
  // -----------------------------

  let score = 0;

  if (email) score += 10;
  if (phone) score += 10;

  if (
    lowerText.includes("summary") ||
    lowerText.includes("objective") ||
    lowerText.includes("profile")
  ) {
    score += 10;
  }

  if (foundSkills.length >= 5) {
    score += 15;
  } else if (foundSkills.length >= 3) {
    score += 10;
  } else if (foundSkills.length > 0) {
    score += 5;
  }

  if (projects.length > 0) score += 15;

  if (
    lowerText.includes("education") ||
    lowerText.includes("b.tech") ||
    lowerText.includes("btech") ||
    lowerText.includes("bachelor")
  ) {
    score += 10;
  }

  if (certifications.length > 0) score += 10;

  if (
    lowerText.includes("experience") ||
    lowerText.includes("internship") ||
    lowerText.includes("training")
  ) {
    score += 5;
  }

  if (linkedin) score += 2.5;
  if (github) score += 2.5;

  score = Math.min(Math.round(score), 100);

  // -----------------------------
  // STRENGTHS
  // -----------------------------

  const strengths = [];

  if (foundSkills.length >= 5) {
    strengths.push("Good technical skill set");
  }

  if (projects.length > 0) {
    strengths.push("Projects are mentioned");
  }

  if (certifications.length > 0) {
    strengths.push("Certifications are included");
  }

  if (linkedin || github) {
    strengths.push("Professional links are available");
  }

  if (email && phone) {
    strengths.push("Contact information is available");
  }

  // -----------------------------
  // WEAKNESSES
  // -----------------------------

  const weaknesses = [];

  if (foundSkills.length < 5) {
    weaknesses.push("Add more relevant technical skills");
  }

  if (!projects.length) {
    weaknesses.push("Add project details");
  }

  if (!certifications.length) {
    weaknesses.push("Add relevant certifications");
  }

  if (!linkedin) {
    weaknesses.push("Add LinkedIn profile");
  }

  if (!github) {
    weaknesses.push("Add GitHub profile");
  }

  if (!lowerText.includes("experience") && !lowerText.includes("internship")) {
    weaknesses.push("Add internship or practical experience");
  }

  // -----------------------------
  // SUGGESTIONS
  // -----------------------------

  const suggestions = [];

  if (foundSkills.length < 5) {
    suggestions.push("Add more job-relevant technical skills");
  }

  if (!projects.length) {
    suggestions.push("Add 2-3 strong projects with technologies used");
  }

  if (!certifications.length) {
    suggestions.push("Add relevant certifications");
  }

  if (!linkedin) {
    suggestions.push("Add your LinkedIn profile");
  }

  if (!github) {
    suggestions.push("Add your GitHub profile");
  }

  if (!lowerText.includes("experience") && !lowerText.includes("internship")) {
    suggestions.push("Include internship, training or practical experience");
  }

  // -----------------------------
  // RECOMMENDATION
  // -----------------------------

  let recommendation = "";

  if (score >= 80) {
    recommendation = "Your resume is strong and ready for placement applications.";
  } else if (score >= 60) {
    recommendation = "Your resume is good, but a few improvements can make it stronger.";
  } else if (score >= 40) {
    recommendation = "Your resume needs some improvements before applying.";
  } else {
    recommendation = "Your resume needs significant improvement before placement applications.";
  }

  // -----------------------------
  // RETURN RESULT
  // -----------------------------

  return {
    resumeScore: score,
    atsScore: score,

    foundSkills,
    missingSkills,

    strengths,
    weaknesses,
    suggestions,

    recommendation,

    extractedProfile: {
      name,
      email,
      phone,
      address,
      cgpa,
      linkedin,
      github,
      skills: foundSkills,
      projects,
      certifications,
    },
  };
};

module.exports = analyzeResume;