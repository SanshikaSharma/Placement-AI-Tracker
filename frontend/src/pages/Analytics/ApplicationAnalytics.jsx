import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function ApplicationAnalytics() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/application/all"
        );

        setApplications(res.data.applications || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadApplications();
  }, []);

  const total = applications.length;

  const applied = applications.filter(
    (app) => app.status === "Applied"
  ).length;

 const shortlisted = applications.filter(
  (app) => app.status === "Shortlisted"
).length;

  const interview = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const selected = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;
  const chartData = [
  { name: "Applied", value: applied },
  { name: "Shortlisted", value: shortlisted },
  { name: "Interview", value: interview },
  { name: "Selected", value: selected },
  { name: "Rejected", value: rejected },
];

const COLORS = [
  "#2196F3",
  "#FFC107",
  "#FF9800",
  "#4CAF50",
  "#F44336",
];

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        📊 Application Analytics
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <Card title="Total Applications" value={total} color="#007bff" />

        <Card title="Applied" value={applied} color="#17a2b8" />

        <Card title="Shortlisted" value={shortlisted} color="#ffc107" />

        <Card title="Interview" value={interview} color="#fd7e14" />

        <Card title="Selected" value={selected} color="#28a745" />

        <Card title="Rejected" value={rejected} color="#dc3545" />
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div
  style={{
    display: "flex",
    gap: "30px",
    marginTop: "40px",
    flexWrap: "wrap",
  }}
>
  {/* Pie Chart */}
  <div
    style={{
      flex: 1,
      minWidth: "350px",
      background: "white",
      borderRadius: "10px",
      padding: "20px",
    }}
  >
    <h2>Status Distribution</h2>

    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Bar Chart */}
  <div
    style={{
      flex: 1,
      minWidth: "350px",
      background: "white",
      borderRadius: "10px",
      padding: "20px",
    }}
  >
    <h2>Applications by Status</h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#1976d2"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
        <h2>Recent Applications</h2>

        {applications.length === 0 ? (
          <p>No Applications Found</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Company</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {applications
                .slice()
                .reverse()
                .slice(0, 5)
                .map((app) => (
                  <tr key={app._id}>
                    <td>{app.company?.companyName}</td>

                    <td>{app.status}</td>

                    <td>
                      {new Date(
                        app.appliedAt
                      ).toLocaleDateString()}
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

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: "25px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,.2)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default ApplicationAnalytics;