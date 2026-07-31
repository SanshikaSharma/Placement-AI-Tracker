function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      company: "Microsoft",
      message:
        "Placement AI Tracker helped me stay organized throughout the placement season.",
    },
    {
      name: "Priya Verma",
      company: "Google",
      message:
        "The dashboard and analytics made tracking applications much easier.",
    },
    {
      name: "Aman Gupta",
      company: "Amazon",
      message:
        "Resume tracking and AI insights gave me confidence during interviews.",
    },
  ];

  return (
    <section className="py-24 bg-slate-100">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center mb-14">
          Student Success Stories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <p className="text-gray-600 italic">
                "{item.message}"
              </p>

              <h3 className="mt-8 text-xl font-bold">
                {item.name}
              </h3>

              <p className="text-blue-600">
                Placed at {item.company}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;