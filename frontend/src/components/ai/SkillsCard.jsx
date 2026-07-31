function SkillsCard({
  title,
  skills = [],
  color = "bg-blue-600",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        {title}
      </h2>

      {skills.length === 0 ? (
        <p className="text-gray-500">
          No skills available.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`${color} text-white px-4 py-2 rounded-full font-medium`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

    </div>
  );
}

export default SkillsCard;