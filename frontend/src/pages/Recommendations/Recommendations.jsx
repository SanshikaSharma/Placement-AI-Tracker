import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const storedUser =
          sessionStorage.getItem("user") ||
          localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("Please login first.");
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch (parseError) {
          console.error("User JSON Error:", parseError);
          throw new Error(
            "Invalid login information. Please login again.", { cause: parseError }
          );
        }

        const studentId =
          user._id ||
          user.id ||
          user.userId;

        if (!studentId) {
          throw new Error(
            "Student ID not found. Please logout and login again."
          );
        }

        console.log(
          "Recommendation Student ID:",
          studentId
        );

        // =====================================
        // GET AI RECOMMENDATIONS
        // =====================================

        const response = await api.get(
          `/recommendations/${studentId}`
        );

        console.log(
          "Recommendation Response:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Unable to load recommendations."
          );
        }

        if (mounted) {
          setRecommendations(
            Array.isArray(response.data.recommendations)
              ? response.data.recommendations
              : []
          );
        }
      } catch (err) {
        console.error(
          "Recommendation Error:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load recommendations."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Finding Best Job Recommendations...
          </h1>

          <p className="text-gray-500 mt-3">
            AI is analyzing your profile and available jobs.
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Unable to Load Recommendations
          </h2>

          <p className="text-red-500 mt-3">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          AI Job Recommendations
        </h1>

        <p className="text-gray-600 mt-2">
          Jobs are ranked according to how well they match
          your profile.
        </p>
      </div>

      {/* EMPTY STATE */}

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold text-gray-800">
            No Recommendations Available
          </h2>

          <p className="text-gray-500 mt-3">
            No suitable job opportunities are currently
            available.
          </p>

          <Link
            to="/companies"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Explore Companies
          </Link>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {recommendations.map((item) => {
            const company = item.company || {};

            // =====================================
            // AI RECOMMENDATION SCORE
            // =====================================

            const rawScore = Number(item.score);

            const score = Number.isFinite(rawScore)
              ? Math.min(Math.max(rawScore, 0), 100)
              : 0;

            // =====================================
            // SCORE COLORS
            // =====================================

            let scoreColor =
              "bg-red-100 text-red-700";

            let progressColor =
              "bg-red-500";

            let matchText =
              "Low Match";

            if (score >= 85) {
              scoreColor =
                "bg-green-100 text-green-700";

              progressColor =
                "bg-green-500";

              matchText =
                "Excellent Match";
            } else if (score >= 70) {
              scoreColor =
                "bg-blue-100 text-blue-700";

              progressColor =
                "bg-blue-500";

              matchText =
                "Good Match";
            } else if (score >= 50) {
              scoreColor =
                "bg-yellow-100 text-yellow-700";

              progressColor =
                "bg-yellow-500";

              matchText =
                "Moderate Match";
            }

            return (
              <div
                key={company._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >

                {/* ================================= */}
                {/* COMPANY HEADER */}
                {/* ================================= */}

                <div className="flex justify-between items-start gap-4">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {company.companyName || "Company"}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {company.role || "Placement Role"}
                    </p>
                  </div>

                  {/* SCORE */}

                  <div
                    className={`px-4 py-2 rounded-full font-bold text-lg whitespace-nowrap ${scoreColor}`}
                  >
                    {score}%
                  </div>

                </div>

                {/* ================================= */}
                {/* MATCH INFORMATION */}
                {/* ================================= */}

                <div className="mt-4">

                  <div className="flex justify-between items-center mb-2">

                    <span className="text-sm font-semibold text-gray-600">
                      AI Match Score
                    </span>

                    <span className="text-sm font-bold text-gray-700">
                      {matchText}
                    </span>

                  </div>

                  {/* PROGRESS BAR */}

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

                    <div
                      className={`${progressColor} h-3 rounded-full transition-all duration-700`}
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                  <div className="text-right mt-1">
                    <span className="text-sm font-bold">
                      {score}% Match
                    </span>
                  </div>

                </div>

                {/* ================================= */}
                {/* COMPANY DETAILS */}
                {/* ================================= */}

                <div className="mt-5 space-y-2 text-gray-700">

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
                    <strong>Eligibility:</strong>{" "}
                    {company.eligibility || "-"}
                  </p>

                </div>

                {/* ================================= */}
                {/* AI RECOMMENDATION */}
                {/* ================================= */}

                {item.recommendation && (
                  <div className="mt-5 bg-gray-50 rounded-xl p-4">

                    <h3 className="font-semibold text-gray-800 mb-2">
                      🤖 AI Recommendation
                    </h3>

                    <p className="text-sm text-gray-600">
                      {item.recommendation}
                    </p>

                  </div>
                )}

                {/* ================================= */}
                {/* REASONS */}
                {/* ================================= */}

                {Array.isArray(item.reasons) &&
                  item.reasons.length > 0 && (
                    <div className="mt-5">

                      <h3 className="font-semibold text-gray-800 mb-2">
                        Why this job matches
                      </h3>

                      <ul className="space-y-2">

                        {item.reasons.map(
                          (reason, index) => (
                            <li
                              key={`${company._id}-reason-${index}`}
                              className="text-sm text-gray-600"
                            >
                              <span className="text-green-600 font-bold">
                                ✓
                              </span>{" "}
                              {reason}
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )}

                {/* ================================= */}
                {/* MISSING SKILLS */}
                {/* ================================= */}

                {Array.isArray(item.missingSkills) &&
                  item.missingSkills.length > 0 && (
                    <div className="mt-5">

                      <h3 className="font-semibold text-gray-800 mb-2">
                        Missing Skills
                      </h3>

                      <div className="flex flex-wrap gap-2">

                        {item.missingSkills.map(
                          (skill, index) => (
                            <span
                              key={`${company._id}-skill-${index}`}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}

                {/* ================================= */}
                {/* VIEW COMPANY */}
                {/* ================================= */}

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