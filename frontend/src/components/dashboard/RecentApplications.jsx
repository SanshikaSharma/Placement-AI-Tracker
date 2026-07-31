function RecentApplications() {
  const applications = [
    {
      company: "Google",
      status: "Applied",
    },
    {
      company: "Amazon",
      status: "Interview",
    },
    {
      company: "Infosys",
      status: "Selected",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        Recent Applications
      </h2>

      <div className="space-y-4">

        {applications.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-3"
          >
            <span>{item.company}</span>

            <span className="font-semibold text-blue-700">
              {item.status}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentApplications;