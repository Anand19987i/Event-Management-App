import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import ViewSlide from './ViewSlide';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewProfile, setViewProfile] = useState(false);
  const { user, userDetail } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  // Handle search query input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search query submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);  // Redirect to search page with query
    }
  };

  const dropdownRef = useRef(null);
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setViewProfile(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="flex items-center justify-between w-full px-20 h-20 font-montserrat shadow-md">
      <Link to="/" className="text-3xl font-bold flex items-center gap-1">
        <span className="font-montserrat text-purple-700 tracking-tight">E</span>
        <span className="text-gray-800 tracking-wide">vent</span>
        <span className="font-serif text-purple-900 italic">i</span>
        <span className="text-gray-800 tracking-wide">fy</span>
      </Link>

      {/* Centered Search Bar */}
      <div className="flex justify-center items-center absolute w-1/2 border left-1/4 border-gray-300 rounded-md">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full py-1 rounded-md">
          <input
            type="text"
            placeholder="Type to search for events, workshops, and more..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="py-2 px-4  rounded-md w-full outline-none"
          />
          <button
            type="submit"
            className="ml-2 text-purple-800 py-2 px-4 rounded-md"
          >
            <Search />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-5">
        {user ? (
          <div className="flex items-center gap-1">
            <img
              src={userDetail?.avatar || '/default-pic.avif'}
              alt="UserImage"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setViewProfile(!viewProfile)}
            />
            <span className="cursor-pointer font-medium flex gap-1">
              Hi, {user?.name || <p>Guest</p>}
            </span>
            <div
              ref={dropdownRef}
              className={`absolute z-10 right-0 top-0 w-1/4 transition-all duration-300 ease-in-out transform ${viewProfile ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
              {viewProfile && <ViewSlide />}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link
              to={`/login`}
              className="py-2 px-3 rounded hover:bg-purple-800 bg-purple-600 text-white font-medium text-sm"
            >
              Login
            </Link>
            <Link
              to={`/signup`}
              className="py-2 px-3 rounded hover:bg-gray-800 bg-black text-white font-medium text-sm"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
