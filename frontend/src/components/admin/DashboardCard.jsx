function DashboardCard({
  title,
  value,
  icon,
  bgColor = "bg-white",
  textColor = "text-black",
}) {
  return (
    <div
      className={`${bgColor} rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${textColor}`}>
            {value}
          </h2>

        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default DashboardCard;