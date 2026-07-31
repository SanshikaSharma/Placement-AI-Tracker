import { useEffect, useState } from "react";
import ATSCard from "../../components/ai/ATSCard";
import SkillsCard from "../../components/ai/SkillsCard";
import SuggestionsCard from "../../components/ai/SuggestionsCard";
import { analyzeResume } from "../../services/aiService";

function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) return;

        const res = await analyzeResume(user.id);

        if (res.success) {
          setAnalysis(res.analysis);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Analyzing Resume...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-10 text-center">
        No analysis available.
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-8">
        AI Resume Analysis
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">

        <ATSCard score={analysis.atsScore} />

        <SuggestionsCard
          suggestions={analysis.suggestions}
        />

        <SkillsCard
          title="Skills Found"
          skills={analysis.foundSkills}
          color="bg-green-600"
        />

        <SkillsCard
          title="Missing Skills"
          skills={analysis.missingSkills}
          color="bg-red-600"
        />
      
      </div>

    </div>
  );
}

export default ResumeAnalysis;