import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-blue-700 py-24 text-white">
      <div className="max-w-5xl mx-auto text-center px-8">

        <h2 className="text-5xl font-bold">
          Ready to Start Your Placement Journey?
        </h2>

        <p className="mt-6 text-xl text-blue-100">
          Register today and manage your placements with AI-powered tools.
        </p>

        <Link
          to="/register"
          className="inline-block mt-10 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Register Now
        </Link>

      </div>
    </section>
  );
}

export default CTA;