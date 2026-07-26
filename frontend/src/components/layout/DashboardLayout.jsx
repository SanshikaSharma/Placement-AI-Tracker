import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";

import {
  FaBuilding,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function DashboardV2() {
  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Welcome Back
        </h1>

        <p className="text-gray-500 mt-2">
          Track your placement journey with AI.
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Companies"
          value="32"
          icon={<FaBuilding />}
          color="#2563EB"
        />

        <StatCard
          title="Applications"
          value="18"
          icon={<FaBriefcase />}
          color="#7C3AED"
        />

        <StatCard
          title="Selected"
          value="5"
          icon={<FaCheckCircle />}
          color="#16A34A"
        />

        <StatCard
          title="Upcoming"
          value="4"
          icon={<FaClock />}
          color="#F59E0B"
        />

      </div>

    </DashboardLayout>
  );
}

export default DashboardV2;