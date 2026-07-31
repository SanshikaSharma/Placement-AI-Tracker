import { useEffect, useState } from "react";
import {
  getMyApplications,
  withdrawApplication,
} from "../../services/applicationService";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
       const user = JSON.parse(localStorage.getItem("user"));

if (!user?.id) {
  alert("Please login first");
  return;
}

const res = await getMyApplications(user.id);

        setApplications(res.applications || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadApplications();
  }, []);

  const handleWithdraw = async (id) => {
    const confirmWithdraw = window.confirm(
      "Withdraw this application?"
    );

    if (!confirmWithdraw) return;

    try {
      await withdrawApplication(id);

      setApplications((prev) =>
        prev.filter((app) => app._id !== id)
      );

      alert("Application Withdrawn");
    } catch (err) {
      console.error(err);
      alert("Unable to Withdraw");
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          No Applications Found
        </div>
      ) : (
        <div className="space-y-5">

          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold">
                  {app.company?.companyName}
                </h2>

                <p>{app.company?.role}</p>

                <p className="text-gray-500">
                  {app.company?.location}
                </p>

                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {app.status}
                </span>
              </div>

              <button
                onClick={() => handleWithdraw(app._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Withdraw
              </button>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyApplications;