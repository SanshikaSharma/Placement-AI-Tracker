import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function CompanyDetails() {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // =====================================
  // LOAD COMPANY
  // =====================================
  useEffect(() => {
    let ignore = false;

    const fetchCompany = async () => {
      try {
        if (!id) {
          console.error("Company ID missing");
          return;
        }

        const res = await api.get(`/company/${id}`);

        console.log("Company API Response:", res.data);

        if (!ignore && res.data.success) {
          setCompany(res.data.company);
        }
      } catch (error) {
        console.error(
          "Company Details Error:",
          error
        );

        if (!ignore) {
          alert(
            error.response?.data?.message ||
              "Unable to load company."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCompany();

    return () => {
      ignore = true;
    };
  }, [id]);

  // =====================================
  // APPLY TO COMPANY
  // =====================================
  const handleApply = async () => {
    try {
      if (applying) return;

      // ---------------------------------
      // Get logged-in user
      // ---------------------------------
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login first.");
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (parseError) {
        console.error(
          "User JSON Parse Error:",
          parseError
        );

        alert(
          "Login information is invalid. Please login again."
        );

        return;
      }

      // ---------------------------------
      // Get Student ID safely
      // ---------------------------------
      const studentId =
        user._id ||
        user.id ||
        user.userId;

      // ---------------------------------
      // Get Company ID safely
      // ---------------------------------
      const companyId =
        company?._id || id;

      console.log(
        "================================"
      );
      console.log(
        "===== COMPANY DETAILS APPLY ====="
      );
      console.log(
        "User:",
        user
      );
      console.log(
        "Student ID:",
        studentId
      );
      console.log(
        "Company ID:",
        companyId
      );
      console.log(
        "================================"
      );

      // ---------------------------------
      // Validate Student ID
      // ---------------------------------
      if (!studentId) {
        alert(
          "Student ID not found. Please logout and login again."
        );
        return;
      }

      // ---------------------------------
      // Validate Company ID
      // ---------------------------------
      if (!companyId) {
        alert(
          "Company ID not found."
        );
        return;
      }

      setApplying(true);

      // ---------------------------------
      // Apply API
      // ---------------------------------
      const res = await api.post(
        "/application/apply",
        {
          companyId,
          studentId,
        }
      );

      console.log(
        "Application Response:",
        res.data
      );

      alert(
        res.data.message ||
          "Application submitted successfully."
      );
    } catch (error) {
      console.error(
        "Apply Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Application Failed"
      );
    } finally {
      setApplying(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
          <p className="text-xl font-semibold">
            Loading Company...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // COMPANY NOT FOUND
  // =====================================
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-red-600">
            Company Not Found
          </h2>

          <Link
            to="/companies"
            className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-4xl font-bold mb-8">
            {company.companyName}
          </h1>

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <h3 className="font-semibold text-lg">
                Role
              </h3>

              <p className="text-gray-600">
                {company.role || "-"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Package
              </h3>

              <p className="text-gray-600">
                {company.package || "-"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Location
              </h3>

              <p className="text-gray-600">
                {company.location || "-"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Job Type
              </h3>

              <p className="text-gray-600">
                {company.jobType || "Full Time"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Minimum CGPA
              </h3>

              <p className="text-gray-600">
                {company.minimumCGPA ?? 0}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Status
              </h3>

              <span
                className={`inline-block px-4 py-2 rounded-full text-white ${
                  company.status === "Open"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {company.status}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Deadline
              </h3>

              <p className="text-gray-600">
                {company.deadline
                  ? new Date(
                      company.deadline
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Eligibility
              </h3>

              <p className="text-gray-600">
                {company.eligibility || "-"}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-8">

            <h3 className="font-semibold text-lg mb-2">
              Description
            </h3>

            <p className="text-gray-600">
              {company.description ||
                "No Description Available"}
            </p>

          </div>

          {/* Required Skills */}
          <div className="mt-8">

            <h3 className="font-semibold text-lg mb-3">
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-3">

              {company.skillsRequired?.length > 0 ? (
                company.skillsRequired.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-gray-500">
                  No specific skills listed.
                </p>
              )}

            </div>

          </div>

          {/* Eligible Branches */}
          <div className="mt-8">

            <h3 className="font-semibold text-lg mb-3">
              Eligible Branches
            </h3>

            <div className="flex flex-wrap gap-3">

              {company.eligibleBranches?.length > 0 ? (
                company.eligibleBranches.map(
                  (branch, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-2 rounded-full"
                    >
                      {branch}
                    </span>
                  )
                )
              ) : (
                <p className="text-gray-500">
                  All branches eligible.
                </p>
              )}

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">

            <button
              onClick={handleApply}
              disabled={applying}
              className={`text-white px-6 py-3 rounded-lg ${
                applying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {applying
                ? "Applying..."
                : "Apply Now"}
            </button>

            {company.applyLink && (
              <a
                href={company.applyLink}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Company Apply Link
              </a>
            )}

            <Link
              to="/placements"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
            >
              Back
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CompanyDetails;