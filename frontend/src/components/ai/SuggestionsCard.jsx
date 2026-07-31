function SuggestionsCard({ suggestions = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        AI Suggestions
      </h2>

      {suggestions.length === 0 ? (
        <p className="text-gray-500">
          No suggestions available.
        </p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded"
            >
              {item}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default SuggestionsCard;