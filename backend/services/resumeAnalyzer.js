const fs = require("fs");
const pdfParse = require("pdf-parse");

const skillList = [
  "html",
  "css",
  "javascript",
  "react",
  "node",
  "express",
  "mongodb",
  "mysql",
  "java",
  "python",
  "git",
  "github",
];

async function analyzeResume(filePath) {
  const dataBuffer = fs.readFileSync(filePath);

  const pdfData = await pdfParse(dataBuffer);

  const text = pdfData.text.toLowerCase();

  const foundSkills = skillList.filter((skill) =>
    text.includes(skill)
  );

  const missingSkills = skillList.filter(
    (skill) => !foundSkills.includes(skill)
  );

  const atsScore = Math.round(
    (foundSkills.length / skillList.length) * 100
  );

  return {
    atsScore,
    foundSkills,
    missingSkills,
  };
}

module.exports = analyzeResume;