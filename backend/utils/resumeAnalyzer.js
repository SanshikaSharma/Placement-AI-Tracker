const skills = require("./skillDatabase");

const analyzeResume = (resumeText) => {
  const text = resumeText.toLowerCase();

  const foundSkills = [];

  skills.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  const missingSkills = skills.filter(
    (skill) => !foundSkills.includes(skill)
  );

  const atsScore = Math.min(
    100,
    Math.round((foundSkills.length / skills.length) * 100)
  );

  return {
    atsScore,
    foundSkills,
    missingSkills: missingSkills.slice(0, 10),

    suggestions: [
      "Add more technical skills.",
      "Mention GitHub profile.",
      "Include internships.",
      "Add certifications.",
      "Improve project descriptions.",
    ],
  };
};

module.exports = analyzeResume;