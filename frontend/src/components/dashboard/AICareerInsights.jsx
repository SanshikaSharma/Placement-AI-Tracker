import {
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

function AICareerInsights({ stats }) {
  const suggestions = [];

  if (stats.companies < 20) {
    suggestions.push({
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      text: "Apply to more companies to increase your chances.",
    });
  }

  if (stats.applications < 15) {
    suggestions.push({
      icon: <FaLightbulb className="text-blue-500" />,
      text: "Keep applying regularly to maintain momentum.",
    });
  }

  if (stats.offers > 0) {
    suggestions.push({
      icon: <FaCheckCircle className="text-green-500" />,
      text: "Congratulations! You have received an offer.",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      icon: <FaCheckCircle className="text-green-500" />,
      text: "Great work! Your placement progress looks healthy.",
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
         AI Career Insights
      </h2>

      <div className="space-y-4">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <div className="mt-1">{item.icon}</div>

            <p className="text-gray-700">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AICareerInsights;