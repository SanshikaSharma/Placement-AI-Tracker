import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 h-20">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <FaBrain className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Placement AI
            </h1>

            <p className="text-xs text-gray-500">
              Smart Career Platform
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#analytics" className="hover:text-blue-600">Analytics</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>

        {/* Login */}
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
        >
          Login
        </Link>

      </div>
    </motion.nav>
  );
}

export default Navbar;