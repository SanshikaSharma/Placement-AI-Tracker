function AISuggestions() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-5">
        AI Career Suggestions
      </h2>

      <div className="space-y-4">

        <div className="bg-blue-50 rounded-xl p-4">
          Complete your profile to improve placement chances.
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          Apply to at least 5 companies this week.
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          Practice DSA for upcoming coding rounds.
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          Upload an ATS-friendly resume.
        </div>

      </div>
    </div>
  );
}

export default AISuggestions;