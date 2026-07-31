import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    selectedStudents: 0,
    recentApplications: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getAdminDashboard();

        setDashboard({
          totalStudents: res.totalStudents,
          totalCompanies: res.totalCompanies,
          totalApplications: res.totalApplications,
          selectedStudents: res.selectedStudents,
          recentApplications: res.recentApplications || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Students"
          value={dashboard.totalStudents}
          color="bg-blue-600"
        />

        <StatCard
          title="Companies"
          value={dashboard.totalCompanies}
          color="bg-green-600"
        />

        <StatCard
          title="Applications"
          value={dashboard.totalApplications}
          color="bg-purple-600"
        />

        <StatCard
          title="Selected"
          value={dashboard.selectedStudents}
          color="bg-orange-500"
        />

      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-lg mt-10 p-6">

        <h2 className="text-2xl font-bold mb-5">
          Recent Applications
        </h2>

        {dashboard.recentApplications.length === 0 ? (
          <p className="text-gray-500">
            No recent applications found.
          </p>
        ) : (
          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left p-3">Student</th>

                <th className="text-left p-3">Company</th>

                <th className="text-left p-3">Status</th>

              </tr>

            </thead>

            <tbody>

              {dashboard.recentApplications.map((app) => (

                <tr key={app._id} className="border-b">

                  <td className="p-3">
                    {app.student?.name}
                  </td>

                  <td className="p-3">
                    {app.company?.companyName}
                  </td>

                  <td className="p-3">
                    {app.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;