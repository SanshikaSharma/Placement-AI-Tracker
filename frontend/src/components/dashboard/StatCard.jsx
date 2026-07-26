import { motion } from "framer-motion";

function StatCard({ title, value, icon, color, change }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-green-600 text-sm mt-2">
            {change}
          </p>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl ${color}`}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}

export default StatCard;