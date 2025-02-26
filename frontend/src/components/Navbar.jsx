import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, Menu } from "lucide-react";
import ViewSlide from "./ViewSlide";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewProfile, setViewProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, userDetail } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle search query input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search query submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  // Close profile dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setViewProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-20 h-16 shadow-md bg-white relative">
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold flex items-center gap-1">
        <span className="text-purple-700 tracking-tight">E</span>
        <span className="text-gray-800 tracking-wide">vent</span>
        <span className="text-purple-900 italic font-serif">i</span>
        <span className="text-gray-800 tracking-wide">fy</span>
      </Link>

      {/* Search Bar */}
      <div className="hidden md:flex items-center w-1/2 border border-gray-300 rounded-md overflow-hidden">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
          <input
            type="text"
            placeholder="Search for events, workshops..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="py-2 px-4 w-full text-gray-700 outline-none"
          />
          <button
            type="submit"
            className=" text-white py-2 px-4 hover:bg-purple-700 transition"
          >
            <Search className="text-purple-800 font-bold"/>
          </button>
        </form>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-8 h-8 text-gray-700" />
        </button>
      </div>

      {/* User Section */}
      <div className={`md:flex items-center gap-4 ${menuOpen ? "flex flex-col absolute top-16 right-6 bg-white p-4 shadow-lg rounded-lg z-50" : "hidden"}`}>
        {user ? (
          <div className="relative flex items-center gap-2">
            {/* Profile Image */}
            <img
              src={userDetail?.avatar || "/default-pic.avif"}
              alt="UserImage"
              className="w-10 h-10 rounded-full cursor-pointer object-cover border border-gray-300"
              onClick={() => setViewProfile(!viewProfile)}
            />

            {/* Greeting */}
            <span className="cursor-pointer font-medium text-gray-800">
              Hi, {user?.name || "Guest"}
            </span>

            {/* Profile Dropdown */}
            {viewProfile && (
              <div
                ref={dropdownRef}
                className="absolute top-12 -right-10 w-80 bg-white shadow-lg rounded-lg p-4 transition-all duration-200 ease-in-out z-50"
              >
                <ViewSlide />
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="py-2 px-4 rounded-lg bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 rounded-lg bg-gray-800 text-white font-medium text-sm hover:bg-gray-900 transition"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
