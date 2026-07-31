function ActivityTimeline() {
  const activities = [
    {
      title: "Applied to Google",
      time: "2 hours ago",
    },
    {
      title: "Resume uploaded",
      time: "Yesterday",
    },
    {
      title: "Microsoft interview scheduled",
      time: "2 days ago",
    },
    {
      title: "Profile updated",
      time: "3 days ago",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((item, index) => (
          <div key={index} className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-semibold">
              {item.title}
            </h3>

            <p className="text-sm text-gray-500">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityTimeline;