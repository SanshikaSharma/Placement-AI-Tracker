import { Link } from "react-router-dom";

function StatCard({ title, value, color, to }) {
  const card = (
    <div
      className={`${color} text-white rounded-2xl shadow-lg p-8 transition hover:scale-[1.02] ${
        to ? "cursor-pointer" : ""
      }`}
    >
      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      <p className="text-5xl font-bold mt-6">
        {value}
      </p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

export default StatCard;