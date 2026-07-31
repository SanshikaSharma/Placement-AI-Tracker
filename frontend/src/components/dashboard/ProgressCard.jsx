function ProgressCard({ progress = 65 }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        Placement Progress
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-5">

        <div
          className="bg-green-600 h-5 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />

      </div>

      <div className="mt-4 flex justify-between">

        <span className="font-semibold">
          {progress}% Complete
        </span>

        <span className="text-gray-500">
          Keep Improving 🚀
        </span>

      </div>

    </div>
  );
}

export default ProgressCard;