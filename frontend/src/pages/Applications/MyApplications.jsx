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
    const fetchApplications = async () => {
      try {
        // Get current logged-in student
        // IMPORTANT: use sessionStorage
        const storedUser =
          sessionStorage.getItem("user");

        if (!storedUser) {
          alert("Please login first");
          setLoading(false);
          return;
        }

        const user =
          JSON.parse(storedUser);

        const studentId =
          user?._id || user?.id;

        if (!studentId) {
          alert("Student ID not found. Please login again.");
          setLoading(false);
          return;
        }

        console.log(
          "Logged-in Student ID:",
          studentId
        );

        // Fetch ONLY this student's applications
        const res =
          await getMyApplications(
            studentId
          );

        console.log(
          "My Applications:",
          res
        );

        setApplications(
          res.applications || []
        );
      } catch (err) {
        console.error(
          "Fetch Applications Error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
    applications.filter((app) =>
      app.company?.companyName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

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

      {filteredApplications.length ===
      0 ? (
        <div className="bg-white shadow rounded-xl p-8 text-center">
          No Applications Found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {filteredApplications.map(
            (app) => (
              <div
                key={app._id}
                className="bg-white shadow rounded-xl p-6"
              >

                <h2 className="text-2xl font-bold">
                  {
                    app.company
                      ?.companyName
                  }
                </h2>

                <p>
                  <strong>
                    Role:
                  </strong>{" "}
                  {
                    app.company?.role
                  }
                </p>

                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {
                    app.company
                      ?.location
                  }
                </p>

                <p>
                  <strong>
                    Package:
                  </strong>{" "}
                  {
                    app.company
                      ?.package
                  }
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {app.status}
                </p>

                <button
                  onClick={() =>
                    handleWithdraw(
                      app._id
                    )
                  }
                  className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Withdraw
                </button>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default MyApplications;