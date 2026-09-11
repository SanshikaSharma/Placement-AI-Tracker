import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Recommendations() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        // ============================
        // GET LOGGED-IN USER
        // ============================

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("Please login first.");
          return;
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch (parseError) {
          console.error("User JSON Error:", parseError);
          setError("Invalid login information. Please login again.");
          return;
        }

        const studentId =
          user._id ||
          user.id ||
          user.userId;

        if (!studentId) {
          setError(
            "Student ID not found. Please login again."
          );
          return;
        }

        console.log("Logged-in Student ID:", studentId);

        // ============================
        // GET ALL COMPANIES
        // ============================

        const companyResponse = await api.get("/company");

        console.log(
          "Company Response:",
          companyResponse.data
        );

        if (!companyResponse.data?.success) {
          setError(
            companyResponse.data?.message ||
              "Unable to load companies."
          );
          return;
        }

        const allCompanies = Array.isArray(
          companyResponse.data.companies
        )
          ? companyResponse.data.companies
          : [];

        if (allCompanies.length === 0) {
          setCompanies([]);
          return;
        }

        // ============================
        // CHECK ELIGIBILITY
        // ============================

        const recommendationResults = await Promise.all(
          allCompanies.map(async (company) => {
            try {
              if (!company?._id) {
                return {
                  ...company,
                  eligibilityAnalysis: null,
                };
              }

              const response = await api.get(
                `/eligibility/${studentId}/${company._id}`
              );

              console.log(
                `Eligibility for ${company.companyName}:`,
                response.data
              );

              return {
                ...company,
                eligibilityAnalysis:
                  response.data?.analysis || null,
              };
            } catch (eligibilityError) {
              console.error(
                `Eligibility Error - ${company.companyName}:`,
                eligibilityError
              );

              return {
                ...company,
                eligibilityAnalysis: null,
              };
            }
          })
        );

        // ============================
        // SORT BY SCORE
        // ============================

        recommendationResults.sort((a, b) => {
          const scoreA =
            a.eligibilityAnalysis?.score ?? 0;

          const scoreB =
            b.eligibilityAnalysis?.score ?? 0;

          return scoreB - scoreA;
        });

        setCompanies(recommendationResults);
      } catch (err) {
        console.error(
          "Recommendations Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold">
            Finding Best Companies...
          </h1>

          <p className="text-gray-500 mt-3">
            AI is checking your eligibility.
          </p>
        </div>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-300 text-red-700 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">
            Unable to Load Recommendations
          </h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ============================
  // PAGE
  // ============================

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          AI Job Recommendations
        </h1>

        <p className="text-gray-600 mt-2">
          Companies are ranked according to your
          eligibility score.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-semibold">
            No companies available
          </h2>

          <p className="text-gray-500 mt-2">
            No placement companies are currently available.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {companies.map((company) => {
            const analysis =
              company.eligibilityAnalysis;

            const score =
              analysis?.score ?? 0;

            const status =
              analysis?.eligibilityStatus ||
              "Not Available";

            let scoreColor =
              "bg-red-100 text-red-700";

            if (score >= 85) {
              scoreColor =
                "bg-green-100 text-green-700";
            } else if (score >= 70) {
              scoreColor =
                "bg-blue-100 text-blue-700";
            } else if (score >= 50) {
              scoreColor =
                "bg-yellow-100 text-yellow-700";
            }

            return (
              <div
                key={company._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >

                {/* COMPANY HEADER */}

                <div className="flex justify-between items-start gap-3">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {company.companyName || "Company"}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {company.role || "Placement Role"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-2 rounded-full font-bold whitespace-nowrap ${scoreColor}`}
                  >
                    {score}%
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-5 space-y-2">

                  <p>
                    <strong>Package:</strong>{" "}
                    {company.package || "-"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {company.location || "-"}
                  </p>

                  <p>
                    <strong>Job Type:</strong>{" "}
                    {company.jobType || "-"}
                  </p>

                  <p>
                    <strong>Minimum CGPA:</strong>{" "}
                    {company.minimumCGPA ?? 0}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {company.status || "-"}
                  </p>

                </div>

                {/* ELIGIBILITY STATUS */}

                {analysis && (
                  <div className="mt-5">

                    <span
                      className={`inline-block px-4 py-2 rounded-full font-semibold ${scoreColor}`}
                    >
                      {status}
                    </span>

                  </div>
                )}

                {/* AI RECOMMENDATION */}

                {analysis?.recommendation && (
                  <div className="mt-5 bg-gray-50 rounded-lg p-4">

                    <h3 className="font-semibold mb-2">
                      AI Recommendation
                    </h3>

                    <p className="text-gray-700 text-sm">
                      {analysis.recommendation}
                    </p>

                  </div>
                )}

                {/* MISSING SKILLS */}

                {analysis?.missingSkills?.length > 0 && (
                  <div className="mt-5">

                    <h3 className="font-semibold mb-2">
                      Missing Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {analysis.missingSkills.map(
                        (skill, index) => (
                          <span
                            key={`${company._id}-missing-${index}`}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

                {/* ELIGIBILITY RESULTS */}

                {analysis?.results?.length > 0 && (
                  <div className="mt-5">

                    <h3 className="font-semibold mb-2">
                      Eligibility Check
                    </h3>

                    <div className="space-y-2">

                      {analysis.results.map(
                        (result, index) => (
                          <p
                            key={`${company._id}-result-${index}`}
                            className="text-sm text-gray-600"
                          >
                            {result.status}{" "}
                            {result.message}
                          </p>
                        )
                      )}

                    </div>

                  </div>
                )}

                {/* VIEW COMPANY */}

                <Link
                  to={`/company/${company._id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-6 font-semibold"
                >
                  View Company
                </Link>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Recommendations;