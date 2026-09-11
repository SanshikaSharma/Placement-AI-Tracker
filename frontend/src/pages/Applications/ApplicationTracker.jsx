import { useEffect, useState } from "react";

import { getCompanies } from "../../services/companyService";

import {
  applyToCompany,
  getMyApplications,
} from "../../services/applicationService";

import { checkEligibility } from "../../services/eligibilityService";

function ApplicationTracker() {
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [analysis, setAnalysis] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // =========================================
  // GET CURRENT LOGGED-IN STUDENT
  // =========================================
  const getCurrentStudent = () => {
    const storedUser =
      sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "User Data Parse Error:",
        error
      );

      return null;
    }
  };

  // =========================================
  // FETCH COMPANIES + STUDENT APPLICATIONS
  // =========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user =
          getCurrentStudent();

        const studentId =
          user?._id || user?.id;

        // Companies are common for all students
        const companyRes =
          await getCompanies();

        setCompanies(
          companyRes.companies || []
        );

        // Applications are ONLY for
        // the currently logged-in student
        if (studentId) {
          const appRes =
            await getMyApplications(
              studentId
            );

          setApplications(
            appRes.applications || []
          );
        }
      } catch (err) {
        console.error(
          "Application Tracker Error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================================
  // APPLY TO COMPANY
  // =========================================
  const handleApply = async (companyId) => {
    try {
      const user =
        getCurrentStudent();

      const studentId =
        user?._id || user?.id;

      if (!studentId) {
        alert("Please login first");
        return;
      }

      const res =
        await applyToCompany({
          companyId,
          studentId,
        });

      alert(res.message);

      // Refresh ONLY current student's applications
      const appRes =
        await getMyApplications(
          studentId
        );

      setApplications(
        appRes.applications || []
      );
    } catch (err) {
      console.error(
        "Apply Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          err.message ||
          "Unable to Apply"
      );
    }
  };

  // =========================================
  // AI ELIGIBILITY
  // =========================================
  const handleEligibility = async (
    companyId
  ) => {
    try {
      const user =
        getCurrentStudent();

      const studentId =
        user?._id || user?.id;

      if (!studentId) {
        alert("Please login first");
        return;
      }

      const res =
        await checkEligibility(
          studentId,
          companyId
        );

      setAnalysis(
        res.analysis
      );

      setSelectedCompany(
        companyId
      );
    } catch (err) {
      console.error(
        "Eligibility Error:",
        err
      );

      alert(
        "Unable to check eligibility"
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Application Tracker
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {companies.map((company) => {

          // Check application ONLY against
          // current student's applications
          const alreadyApplied =
            applications.find(
              (app) =>
                app.company?._id ===
                company._id
            );

          return (
            <div
              key={company._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              <h2 className="text-2xl font-bold">
                {company.companyName}
              </h2>

              <p className="text-gray-500 mt-2">
                {company.role}
              </p>

              <div className="mt-4 space-y-2">

                <p>
                  <strong>
                    Package:
                  </strong>{" "}
                  {company.package}
                </p>

                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {company.location}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {company.status}
                </p>

              </div>

              {alreadyApplied ? (
                <button
                  disabled
                  className="w-full mt-6 bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed"
                >
                  Applied
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleApply(
                      company._id
                    )
                  }
                  className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl"
                >
                  Apply Now
                </button>
              )}

              <button
                onClick={() =>
                  handleEligibility(
                    company._id
                  )
                }
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
              >
                Check AI Eligibility
              </button>

              {selectedCompany ===
                company._id &&
                analysis && (
                  <div className="mt-6 border rounded-xl p-4 bg-gray-50">

                    <h3 className="text-xl font-bold text-green-700">
                      AI Score :{" "}
                      {analysis.score}%
                    </h3>

                    <div className="mt-3">

                      {analysis.results?.map(
                        (item, index) => (
                          <p
                            key={index}
                          >
                            {item.status}{" "}
                            {item.message}
                          </p>
                        )
                      )}

                    </div>

                    <div className="mt-4 font-semibold text-blue-700">
                      {
                        analysis.recommendation
                      }
                    </div>

                  </div>
                )}

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default ApplicationTracker;