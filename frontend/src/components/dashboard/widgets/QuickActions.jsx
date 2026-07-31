import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <Link
          to="/companies"
          className="bg-blue-600 text-white rounded-xl p-4 text-center hover:bg-blue-700"
        >
          Companies
        </Link>

        <Link
          to="/applications"
          className="bg-green-600 text-white rounded-xl p-4 text-center hover:bg-green-700"
        >
          Applications
        </Link>

        <Link
          to="/profile"
          className="bg-purple-600 text-white rounded-xl p-4 text-center hover:bg-purple-700"
        >
          Profile
        </Link>

        <Link
          to="/analytics"
          className="bg-orange-500 text-white rounded-xl p-4 text-center hover:bg-orange-600"
        >
          Analytics
        </Link>

      </div>
    </div>
  );
}

export default QuickActions;