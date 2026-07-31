import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const data = [
  { month: "Jan", applications: 4 },
  { month: "Feb", applications: 8 },
  { month: "Mar", applications: 10 },
  { month: "Apr", applications: 14 },
  { month: "May", applications: 20 },
  { month: "Jun", applications: 26 },
];

function PlacementChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Placement Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="applications"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PlacementChart;