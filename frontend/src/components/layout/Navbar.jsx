import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  return (
    <div className="h-20 bg-white shadow flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">

        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2">

          <FaSearch className="text-gray-500" />

          <input
            className="bg-transparent outline-none ml-3"
            placeholder="Search..."
          />

        </div>

        <FaBell
          size={22}
          className="cursor-pointer"
        />

        <FaUserCircle
          size={35}
          className="text-blue-600"
        />

      </div>

    </div>
  );
}

export default Navbar;