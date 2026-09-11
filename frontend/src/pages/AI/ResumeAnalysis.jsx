import { useEffect, useState } from "react";
import api from "../../services/api";

import ResumeScoreCard from "../../components/ai/ResumeScoreCard";
import AnalysisSection from "../../components/ai/AnalysisSection";

function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadAnalysis = async () => {
      try {
        // Current logged-in student
        const storedUser = sessionStorage.getItem("user");

        if (!storedUser) {
          if (!ignore) {
            setError("User session not found. Please login again.");
            setLoading(false);
          }
          return;
        }

        const user = JSON.parse(storedUser);

        console.log("Current Logged-in User:", user);

        const userId = user?._id || user?.id;

        if (!userId) {
          if (!ignore) {
            setError("User ID not found. Please login again.");
            setLoading(false);
          }
          return;
        }

        console.log("Analyzing Resume For User ID:", userId);

        const res = await api.get(`/ai/analyze/${userId}`);

        console.log("AI API Response:", res.data);

        if (!ignore) {
          if (res.data.success) {
            setAnalysis(res.data.analysis);
          } else {
            setError(res.data.message || "Analysis failed.");
          }
        }
      } catch (err) {
        console.error("Resume Analysis Error:", err);

        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Unable to analyze resume."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadAnalysis();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-2xl font-bold">
        Analyzing Resume...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <h2 className="text-2xl font-bold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-10 text-xl">
        No Resume Analysis Available
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        AI Resume Analysis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <ResumeScoreCard
          title="Resume Score"
          value={`${analysis.resumeScore}%`}
          color="text-green-600"
        />

        <ResumeScoreCard
          title="ATS Score"
          value={`${analysis.atsScore}%`}
          color="text-blue-600"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <AnalysisSection
          title="Strengths"
          items={analysis.strengths || []}
          color="text-green-600"
        />

        <AnalysisSection
          title="Weaknesses"
          items={analysis.weaknesses || []}
          color="text-red-600"
        />

        <AnalysisSection
          title="Found Skills"
          items={analysis.foundSkills || []}
          color="text-blue-600"
        />

        <AnalysisSection
          title="Missing Skills"
          items={analysis.missingSkills || []}
          color="text-orange-600"
        />

        <AnalysisSection
          title="Suggestions"
          items={analysis.suggestions || []}
          color="text-purple-600"
        />

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold mb-4">
          Final Recommendation
        </h2>

        <p className="text-lg">
          {analysis.recommendation}
        </p>

      </div>

    </div>
  );
}

export default ResumeAnalysis;