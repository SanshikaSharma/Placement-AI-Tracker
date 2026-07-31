function ATSCard({ score = 0 }) {
  let color = "text-red-600";
  let border = "border-red-500";
  let status = "Needs Improvement";

  if (score >= 80) {
    color = "text-green-600";
    border = "border-green-500";
    status = "Excellent";
  } else if (score >= 60) {
    color = "text-yellow-500";
    border = "border-yellow-500";
    status = "Good";
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        ATS Resume Score
      </h2>

      <div
        className={`w-48 h-48 mx-auto rounded-full border-8 ${border} flex flex-col justify-center items-center`}
      >
        <span className={`text-5xl font-bold ${color}`}>
          {score}%
        </span>

        <span className="text-gray-500 mt-2">
          {status}
        </span>
      </div>

      <div className="mt-8">

        <div className="flex justify-between mb-2">
          <span>Resume Strength</span>
          <span>{score}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>

      </div>

    </div>
  );
}

export default ATSCard;