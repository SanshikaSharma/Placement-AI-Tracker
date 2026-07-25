import { useState } from "react";
import axios from "axios";
import "../styles/ResumeAnalysis.css";

function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/resume/analyze",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(res.data.analysis);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Analysis failed"
      );
    }
  };

  return (
  <div className="analysis-card">
      <h2>AI Resume Analyzer</h2>

      <button onClick={handleAnalyze}>
        Analyze Resume
      </button>

      {analysis && (
        <div className="analysis-card">
        <div className="score-card">
  <h2>ATS Score</h2>
  <p
  style={{
    fontSize: "18px",
    fontWeight: "bold",
  }}
>
  {analysis.atsScore >= 80
    ? "🟢 Excellent Resume"
    : analysis.atsScore >= 60
    ? "🟡 Good Resume"
    : "🔴 Needs Improvement"}
</p>
  <h1>{analysis.atsScore}%</h1>
</div>

        <h4> Skills Found</h4>

<div className="skill-container">
  {analysis.foundSkills.map((skill) => (
  <span
  key={skill}
  className="skill-chip"
>
  {skill}
</span>
  ))}
</div>

          <h4>Missing Skills</h4>

<div className="skill-container">
  {analysis.missingSkills.map((skill) => (
   <span
  key={skill}
  className="missing-chip"
>
  {skill}
</span>
  ))}
</div>
        </div>
      )}
    {analysis && (
  <div className="suggestion-box">
    <h4>💡 AI Suggestions</h4>

    <ul>
      {analysis.atsScore < 80 && (
        <li>Add more technical skills to your resume.</li>
      )}

      {analysis.missingSkills.includes("git") && (
        <li>Mention Git/GitHub experience.</li>
      )}

      {analysis.missingSkills.includes("mongodb") && (
        <li>Add a MongoDB project if you have one.</li>
      )}

      {analysis.missingSkills.includes("docker") && (
        <li>Learn Docker and mention it in your skills.</li>
      )}

      <li>Keep your resume to one page.</li>
      <li>Highlight measurable achievements.</li>
    </ul>
  </div>
)}
    </div>
  );
}

export default ResumeAnalysis;