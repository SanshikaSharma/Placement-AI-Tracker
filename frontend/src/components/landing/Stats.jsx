import {
  FaUserGraduate,
  FaBuilding,
  FaBriefcase,
  FaAward,
} from "react-icons/fa";

function Stats() {
  const stats = [
    {
      title: "Registered Students",
      value: "5,000+",
      icon: <FaUserGraduate />,
    },
    {
      title: "Recruiters",
      value: "250+",
      icon: <FaBuilding />,
    },
    {
      title: "Placements",
      value: "3,800+",
      icon: <FaBriefcase />,
    },
    {
      title: "Highest Package",
      value: "₹54 LPA",
      icon: <FaAward />,
    },
  ];

  return (
    <section className="bg-gray-50 py-24">

      <div className="max-w-7xl mx-auto px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-10 text-center hover:-translate-y-2 hover:shadow-xl transition"
            >
              <div className="text-blue-700 text-5xl mb-6 flex justify-center">
                {item.icon}
              </div>

              <h2 className="text-4xl font-bold text-slate-800">
                {item.value}
              </h2>

              <p className="mt-3 text-gray-500">
                {item.title}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Stats;