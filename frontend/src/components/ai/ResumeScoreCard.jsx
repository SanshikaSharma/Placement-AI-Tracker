function ResumeScoreCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-600">
        {title}
      </h3>

      <div className={`text-5xl font-bold mt-4 ${color}`}>
        {value}
      </div>
    </div>
  );
}

export default ResumeScoreCard;