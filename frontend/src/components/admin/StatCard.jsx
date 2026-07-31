function StatCard({ title, value, color }) {
  return (
    <div
      className={`${color} text-white rounded-2xl shadow-lg p-6 hover:scale-105 transition`}
    >
      <h2 className="text-lg font-medium">{title}</h2>

      <h1 className="text-4xl font-bold mt-4">
        {value}
      </h1>
    </div>
  );
}

export default StatCard;