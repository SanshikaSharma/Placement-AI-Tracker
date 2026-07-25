import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PlacementChart({ placements }) {
  const data = [
    {
      name: "Applied",
      value: placements.filter(
        (p) => p.status === "Applied"
      ).length,
    },
    {
      name: "OA",
      value: placements.filter(
        (p) => p.status === "OA"
      ).length,
    },
    {
      name: "Interview",
      value: placements.filter(
        (p) => p.status === "Interview"
      ).length,
    },
    {
      name: "Selected",
      value: placements.filter(
        (p) => p.status === "Selected"
      ).length,
    },
    {
      name: "Rejected",
      value: placements.filter(
        (p) => p.status === "Rejected"
      ).length,
    },
  ];

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#10B981",
    "#EF4444",
  ];

  return (
    <div
      style={{
        width: "100%",
        height: 350,
        margin: "30px 0",
      }}
    >
      <h2>Placement Statistics</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlacementChart;