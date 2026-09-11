function AnalysisSection({ title, items, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className={`text-2xl font-bold mb-4 ${color}`}>
        {title}
      </h2>

      {items.length === 0 ? (
        <p>No Data</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnalysisSection;