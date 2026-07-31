import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import ProgressCard from "../../components/dashboard/ProgressCard";
import ResumeStatus from "../../components/dashboard/ResumeStatus";
import UpcomingDrives from "../../components/dashboard/UpcomingDrives";
import RecentApplications from "../../components/dashboard/RecentApplications";

function DashboardHome() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-gray-100 min-h-screen p-8">

      <WelcomeBanner
        name={user?.name || "Student"}
      />

      <div className="grid md:grid-cols-4 gap-6 mt-8">

        <StatCard
          title="ATS Score"
          value="85%"
          icon="🎯"
          color="bg-green-600"
        />

        <StatCard
          title="Applications"
          value="12"
          icon="📄"
          color="bg-blue-600"
        />

        <StatCard
          title="Companies"
          value="75"
          icon="🏢"
          color="bg-purple-600"
        />

        <StatCard
          title="Interviews"
          value="5"
          icon="💼"
          color="bg-orange-600"
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <ProgressCard progress={65} />

        <ResumeStatus
          uploaded={true}
          analyzed={true}
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <UpcomingDrives />

        <RecentApplications />

      </div>

    </div>
  );
}

export default DashboardHome;