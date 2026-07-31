import { useEffect, useState } from "react";
import api from "../../services/api";

function PlacementDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalApplications: 0,
    selected: 0,
    pending: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/dashboard");

        setStats({
          totalCompanies: res.data.totalCompanies,
          totalApplications: res.data.totalApplications,
          selected: res.data.selected,
          pending: res.data.pending,
        });

      } catch (err) {
        console.error(err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        Placement Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Companies</h2>
          <h1 className="text-4xl font-bold">
            {stats.totalCompanies}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Applications</h2>
          <h1 className="text-4xl font-bold">
            {stats.totalApplications}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Selected</h2>
          <h1 className="text-4xl font-bold text-green-600">
            {stats.selected}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Pending</h2>
          <h1 className="text-4xl font-bold text-orange-600">
            {stats.pending}
          </h1>
        </div>

      </div>

    </div>
  );
}

export default PlacementDashboard;