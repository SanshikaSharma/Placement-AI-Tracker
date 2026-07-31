import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot, FaChartLine, FaFileAlt } from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-linear-to-r from-blue-900 via-blue-700 to-indigo-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="bg-white/20 px-4 py-2 rounded-full">
            AI Powered Placement Portal
          </span>

          <h1 className="text-6xl font-bold mt-8 leading-tight">

            Build Your

            <br />

            Placement Career

            <span className="text-yellow-300">
              {" "}Smarter
            </span>

          </h1>

          <p className="text-blue-100 mt-8 text-xl leading-8">

            One platform for Resume Analysis,
            Placement Tracking,
            Company Management,
            AI Career Insights
            and Interview Preparation.

          </p>

          <div className="flex gap-5 mt-10">

            <Link
              to="/register"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              Student Login
            </Link>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl p-6 text-slate-800">
                <FaRobot className="text-blue-600 text-4xl mb-4" />
                <h3 className="font-bold">AI Resume</h3>
                <p className="text-sm mt-2">
                  ATS Score Analysis
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-slate-800">
                <FaChartLine className="text-green-600 text-4xl mb-4" />
                <h3 className="font-bold">Analytics</h3>
                <p className="text-sm mt-2">
                  Placement Progress
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-slate-800">
                <FaFileAlt className="text-orange-500 text-4xl mb-4" />
                <h3 className="font-bold">Resume Builder</h3>
                <p className="text-sm mt-2">
                  Professional Resume
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-slate-800">
                <h2 className="text-5xl font-bold text-blue-700">
                  250+
                </h2>

                <p className="mt-3">
                  Recruiting Companies
                </p>
              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default Hero;