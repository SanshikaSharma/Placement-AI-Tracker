import { useEffect, useState } from "react";
import {
  getCompanies,
  applyToCompany,
} from "../../services/companyService";
import {
  getMyApplications,
} from "../../services/applicationService";
import {
  checkEligibility,
} from "../../services/eligibilityService";

function ApplicationTracker() {
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [analysis, setAnalysis] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const companyRes = await getCompanies();
        setCompanies(companyRes.companies || []);

        if (user?.id) {
          const appRes = await getMyApplications(user.id);
          setApplications(appRes.applications || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = async (companyId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        alert("Please login first");
        return;
      }

      const res = await applyToCompany(user.id, companyId);

      alert(res.message);

      const appRes = await getMyApplications(user.id);
      setApplications(appRes.applications || []);

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to Apply"
      );
    }
  };

  const handleEligibility = async (companyId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await checkEligibility(
        user.id,
        companyId
      );

      setAnalysis(res.analysis);
      setSelectedCompany(companyId);

    } catch (err) {
      console.error(err);
      alert("Unable to check eligibility");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Application Tracker
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {companies.map((company) => {

          const alreadyApplied = applications.find(
            (app) => app.company?._id === company._id
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
                  <strong>Package:</strong> {company.package}
                </p>

                <p>
                  <strong>Location:</strong> {company.location}
                </p>

                <p>
                  <strong>Status:</strong> {company.status}
                </p>

              </div>

              {alreadyApplied ? (
                <button
                  disabled
                  className="w-full mt-6 bg-gray-400 text-white py-3 rounded-xl"
                >
                  Applied
                </button>
              ) : (
                <button
                  onClick={() => handleApply(company._id)}
                  className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl"
                >
                  Apply Now
                </button>
              )}

              <button
                onClick={() => handleEligibility(company._id)}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
              >
                Check AI Eligibility
              </button>

              {selectedCompany === company._id && analysis && (
                <div className="mt-6 border rounded-xl p-4 bg-gray-50">

                  <h3 className="text-xl font-bold text-green-700">
                    AI Score : {analysis.score}%
                  </h3>

                  <div className="mt-3">

                    {analysis.results.map((item, index) => (
                      <p key={index}>
                        {item.status} {item.message}
                      </p>
                    ))}

                  </div>

                  <div className="mt-4 font-semibold text-blue-700">
                    {analysis.recommendation}
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