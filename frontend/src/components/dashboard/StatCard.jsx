import Card from "../ui/Card";

function StatCard({ title, value, icon, color }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl"
        style={{ background: color }}
      >
        {icon}
      </div>
    </Card>
  );
}

export default StatCard;