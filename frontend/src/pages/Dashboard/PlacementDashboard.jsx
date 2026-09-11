import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function PlacementDashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        // Correct Backend Route
        const res = await api.get("/company");

        if (res.data.success) {
          setCompanies(res.data.companies || []);
        }
      } catch (error) {
        console.error("Company Load Error:", error);

        alert(
          error.response?.data?.message ||
            "Unable to load companies."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const text = search.toLowerCase();

    return (
      company.companyName?.toLowerCase().includes(text) ||
      company.role?.toLowerCase().includes(text) ||
      company.location?.toLowerCase().includes(text)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading Companies...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold">
            Placement Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Explore the latest placement opportunities.
          </p>
        </div>

      </div>

      <input
        type="text"
        placeholder="Search Company / Role / Location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl p-4 mb-8"
      />

      {filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold">
            No Companies Found
          </h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredCompanies.map((company) => (

            <div
              key={company._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <h2 className="text-2xl font-bold">
                {company.companyName}
              </h2>

              <p className="mt-2">
                <strong>Role:</strong> {company.role}
              </p>

              <p>
                <strong>Package:</strong> {company.package}
              </p>

              <p>
                <strong>Location:</strong> {company.location}
              </p>

              <p>
                <strong>Minimum CGPA:</strong>{" "}
                {company.minimumCGPA}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {company.deadline
                  ? new Date(company.deadline).toLocaleDateString()
                  : "-"}
              </p>

              <div className="mt-4">

                <span
                  className={`px-4 py-2 rounded-full text-white ${
                    company.status === "Open"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {company.status}
                </span>

              </div>

              <div className="mt-6 flex gap-3">

                <Link
                  to={`/company/${company._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}

export default PlacementDashboard;