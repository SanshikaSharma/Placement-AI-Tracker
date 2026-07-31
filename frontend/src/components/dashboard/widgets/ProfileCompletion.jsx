function ProfileCompletion() {
  const percentage = 80;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Profile Completion
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-4">

        <div
          className="bg-green-600 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        />

      </div>

      <p className="mt-4 font-semibold text-green-600">
        {percentage}% Complete
      </p>
    </div>
  );
}

export default ProfileCompletion;