import { useEffect, useState } from "react";

import {
  getMyApplications,
  withdrawApplication,
} from "../../services/applicationService";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =============================
  // FETCH LOGGED-IN STUDENT APPLICATIONS
  // =============================
  useEffect(() => {
    const fetchApplications = async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const storedUser =
          sessionStorage.getItem("user") ||
          localStorage.getItem("user");

        if (!storedUser) {
          alert("Please login first");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        const studentId =
          user?._id ||
          user?.id ||
          user?.userId;

        if (!studentId) {
          alert(
            "Student ID not found. Please login again."
          );
          setLoading(false);
          return;
        }

        console.log(
          "Logged-in Student ID:",
          studentId
        );

        const res =
          await getMyApplications(studentId);

        console.log(
          "My Applications:",
          res
        );

        setApplications(
          Array.isArray(res?.applications)
            ? res.applications
            : []
        );
      } catch (err) {
        console.error(
          "Fetch Applications Error:",
          err
        );

        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    fetchApplications(true);

    // Automatically refresh when another part
    // of the application changes placement data.
    const handleDataUpdated = () => {
      fetchApplications(false);
    };

    window.addEventListener(
      "placement-data-updated",
      handleDataUpdated
    );

    return () => {
      window.removeEventListener(
        "placement-data-updated",
        handleDataUpdated
      );
    };
  }, []);

  // =============================
  // WITHDRAW APPLICATION
  // =============================
  const handleWithdraw = async (id) => {
    if (
      !window.confirm(
        "Withdraw this application?"
      )
    ) {
      return;
    }

    try {
      await withdrawApplication(id);

      // Update current page immediately
      setApplications((prev) =>
        prev.filter(
          (app) => app._id !== id
        )
      );

      alert(
        "Application Withdrawn Successfully"
      );
    } catch (err) {
      console.error(
        "Withdraw Error:",
        err
      );

      alert(
        "Unable to Withdraw"
      );
    }
  };

  // =============================
  // SEARCH APPLICATIONS
  // =============================
  const filteredApplications =
    applications.filter((app) => {
      const company =
        app?.company || {};

      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      const companyName =
        company?.companyName ||
        company?.name ||
        company?.title ||
        "";

      const location =
        company?.location || "";

      const packageValue =
        company?.package || "";

      const eligibility =
        company?.eligibility || "";

      const status =
        app?.status || "";

      return (
        companyName
          .toLowerCase()
          .includes(searchText) ||
        location
          .toLowerCase()
          .includes(searchText) ||
        packageValue
          .toLowerCase()
          .includes(searchText) ||
        eligibility
          .toLowerCase()
          .includes(searchText) ||
        status
          .toLowerCase()
          .includes(searchText)
      );
    });

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <div className="p-10 text-2xl font-bold">
        Loading Applications...
      </div>
    );
  }

  // =============================
  // PAGE
  // =============================
  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-6">
        My Applications
      </h1>

      <input
        type="text"
        placeholder="Search Company..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border p-3 rounded-lg w-full mb-8"
      />

      {filteredApplications.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-8 text-center">
          No Applications Found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {filteredApplications.map(
            (app) => {
              const company =
                app?.company || {};

              const companyName =
                company?.companyName ||
                company?.name ||
                company?.title ||
                "Company";

              return (
                <div
                  key={app._id}
                  className="bg-white shadow rounded-xl p-6"
                >

                  {/* COMPANY */}
                  <h2 className="text-2xl font-bold mb-4">
                    {companyName}
                  </h2>

                  {/* LOCATION */}
                  <p className="mb-2">
                    <strong>
                      Location:
                    </strong>{" "}
                    {company?.location ||
                      "Not specified"}
                  </p>

                  {/* PACKAGE */}
                  <p className="mb-2">
                    <strong>
                      Package:
                    </strong>{" "}
                    {company?.package ||
                      "Not specified"}
                  </p>

                  {/* ELIGIBILITY */}
                  <p className="mb-2">
                    <strong>
                      Eligibility:
                    </strong>{" "}
                    {company?.eligibility ||
                      "Not specified"}
                  </p>

                  {/* APPLICATION STATUS */}
                  <p className="mb-2">
                    <strong>
                      Status:
                    </strong>{" "}
                    {app?.status ||
                      "Applied"}
                  </p>

                  {/* APPLICATION DATE */}
                  <p className="mb-4">
                    <strong>
                      Applied On:
                    </strong>{" "}
                    {app?.appliedAt
                      ? new Date(
                          app.appliedAt
                        ).toLocaleDateString()
                      : "Not available"}
                  </p>

                  {/* WITHDRAW */}
                  <button
                    onClick={() =>
                      handleWithdraw(
                        app._id
                      )
                    }
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                  >
                    Withdraw
                  </button>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default MyApplications;