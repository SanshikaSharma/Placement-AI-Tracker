import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >

          <p className="text-blue-600 font-semibold">
            AI Powered Placement Platform
          </p>

          <h1 className="text-6xl font-extrabold leading-tight mt-5">

            Land Your Dream Job
            <br />

            With AI.

          </h1>

          <p className="text-gray-600 text-lg mt-8 leading-8">

            Track applications, analyze resumes,
            manage interviews and prepare for placements
            with one modern platform.

          </p>

          <div className="mt-10 flex gap-5">

            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition">
              Get Started
            </button>

            <button className="border border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-100 transition">
              Live Demo
            </button>

          </div>

        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >

          <div className="h-96 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">

            <h2 className="text-white text-3xl font-bold">
              Dashboard Preview
            </h2>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;