function UpcomingDrives() {
  const drives = [
    {
      company: "Google",
      date: "12 Aug 2026",
    },
    {
      company: "Microsoft",
      date: "18 Aug 2026",
    },
    {
      company: "Amazon",
      date: "25 Aug 2026",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        Upcoming Drives
      </h2>

      <div className="space-y-4">
        {drives.map((drive, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-3"
          >
            <span className="font-semibold">
              {drive.company}
            </span>

            <span className="text-gray-500">
              {drive.date}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default UpcomingDrives;