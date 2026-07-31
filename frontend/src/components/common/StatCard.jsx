function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-gray-500">
            {title}
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white text-3xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;