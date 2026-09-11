import { useEffect, useState } from "react";

import { getCompanies } from "../../services/companyService";
import { checkEligibility } from "../../services/eligibilityService";

function EligibilityPredictor() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [checking, setChecking] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD COMPANIES
  // ==========================================

  useEffect(() => {
    let ignore = false;

    async function loadCompanies() {
      try {
        const res = await getCompanies();

        console.log("Companies Response:", res);

        if (ignore) return;

        if (res.success) {
          setCompanies(res.companies || []);
        } else if (Array.isArray(res)) {
          setCompanies(res);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("Companies Error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Unable to load companies."
          );
        }
      } finally {
        if (!ignore) {
          setLoadingCompanies(false);
        }
      }
    }

    loadCompanies();

    return () => {
      ignore = true;
    };
  }, []);

  // ==========================================
  // CHECK ELIGIBILITY
  // ==========================================

  const handleCheckEligibility = async () => {
    setError("");
    setAnalysis(null);

    if (!selectedCompany) {
      setError("Please select a company first.");
      return;
    }

    try {
      setChecking(true);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      console.log("Logged-in User:", user);

      const studentId = user?._id || user?.id;

      if (!studentId) {
        setError(
          "Student ID not found. Please login again."
        );
        return;
      }

      const res = await checkEligibility(
        studentId,
        selectedCompany
      );

      console.log("Eligibility Response:", res);

      if (res.success) {
        setAnalysis(res.analysis);
      } else {
        setError(
          res.message || "Eligibility check failed."
        );
      }
    } catch (error) {
      console.error(
        "Eligibility Check Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to check eligibility."
      );
    } finally {
      setChecking(false);
    }
  };

  // ==========================================
  // SCORE COLOR
  // ==========================================

  const getScoreColor = (score) => {
    if (score >= 85) {
      return "text-green-600";
    }

    if (score >= 70) {
      return "text-blue-600";
    }

    if (score >= 50) {
      return "text-orange-500";
    }

    return "text-red-600";
  };

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusColor = (status) => {
    if (status === "Highly Eligible") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Eligible") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Partially Eligible") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-red-100 text-red-700";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingCompanies) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          AI Eligibility Predictor
        </h1>

        <p className="mt-4">
          Loading companies...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-8">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          AI Eligibility Predictor
        </h1>

        <p className="text-gray-600 mt-2">
          Check how well your profile matches a
          company's requirements.
        </p>
      </div>

      {/* COMPANY SELECTOR */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Select Company
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <select
            value={selectedCompany}
            onChange={(e) =>
              setSelectedCompany(e.target.value)
            }
            className="border rounded-lg p-3 w-full md:w-96"
          >

            <option value="">
              Select a company
            </option>

            {companies.map((company) => (
              <option
                key={company._id}
                value={company._id}
              >
                {company.companyName ||
                  company.name ||
                  "Unnamed Company"}
              </option>
            ))}

          </select>

          <button
            type="button"
            onClick={handleCheckEligibility}
            disabled={checking || !selectedCompany}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {checking
              ? "Checking..."
              : "Check Eligibility"}
          </button>

        </div>

        {error && (
          <p className="text-red-600 mt-4">
            {error}
          </p>
        )}

      </div>

      {/* ANALYSIS */}

      {analysis && (
        <div>

          {/* SCORE */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">

              <h2 className="text-xl font-semibold">
                Eligibility Score
              </h2>

              <p
                className={`text-6xl font-bold mt-4 ${getScoreColor(
                  analysis.score
                )}`}
              >
                {analysis.score}%
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">

              <h2 className="text-xl font-semibold">
                Eligibility Status
              </h2>

              <div className="mt-6">

                <span
                  className={`px-5 py-3 rounded-full font-bold ${getStatusColor(
                    analysis.eligibilityStatus
                  )}`}
                >
                  {analysis.eligibilityStatus}
                </span>

              </div>

            </div>

          </div>

          {/* MISSING SKILLS */}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

            <h2 className="text-2xl font-bold mb-4">
              Missing Skills
            </h2>

            {analysis.missingSkills?.length > 0 ? (

              <div className="flex flex-wrap gap-3">

                {analysis.missingSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p className="text-green-600 font-semibold">
                🎉 You have all the required skills!
              </p>

            )}

          </div>

          {/* DETAILED RESULTS */}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

            <h2 className="text-2xl font-bold mb-6">
              Eligibility Details
            </h2>

            <div className="space-y-4">

              {analysis.results?.map(
                (result, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 flex gap-3 items-start"
                  >

                    <span className="text-xl">
                      {result.status}
                    </span>

                    <p>
                      {result.message}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          {/* RECOMMENDATION */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              AI Recommendation
            </h2>

            <p className="text-lg text-gray-700">
              {analysis.recommendation}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default EligibilityPredictor;