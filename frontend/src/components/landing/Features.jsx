import {
  FaRobot,
  FaChartLine,
  FaFileAlt,
  FaUserGraduate,
  FaClipboardCheck,
  FaBrain,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI Resume Analysis",
      desc: "Analyze resumes using AI and improve ATS score.",
    },
    {
      icon: <FaChartLine />,
      title: "Placement Analytics",
      desc: "Track placement performance with charts.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Application Tracking",
      desc: "Manage all applications in one place.",
    },
    {
      icon: <FaFileAlt />,
      title: "Resume Builder",
      desc: "Create professional resumes quickly.",
    },
    {
      icon: <FaUserGraduate />,
      title: "Student Dashboard",
      desc: "Personal dashboard with placement insights.",
    },
    {
      icon: <FaBrain />,
      title: "AI Career Insights",
      desc: "Get smart career recommendations.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-slate-100"
    >
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-slate-800">
          Platform Features
        </h2>

        <p className="text-center text-gray-500 mt-4 mb-16">
          Everything a student needs for placements.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
             className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition duration-300"
            >
              <div className="text-blue-700 text-5xl mb-8">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-500">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;