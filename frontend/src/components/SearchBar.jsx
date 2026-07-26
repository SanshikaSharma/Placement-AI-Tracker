import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;