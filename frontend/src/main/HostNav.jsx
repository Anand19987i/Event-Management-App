import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewSlide from '@/components/ViewSlide';
import HostViewSlide from './HostViewSlide';
import { Menu, X } from "lucide-react";

const HostNav = () => {
  const [viewProfile, setViewProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const { host, userDetail } = useSelector(store => store.auth);

  const handleClickOutside = (e) => {
    if (
      (dropdownRef.current && !dropdownRef.current.contains(e.target)) &&
      (menuRef.current && !menuRef.current.contains(e.target))
    ) {
      setViewProfile(false);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-4 sm:px-10 lg:px-20 h-16 font-montserrat shadow-md bg-white relative">
      {/* Logo */}
      <Link to="/host/main" className="text-2xl sm:text-3xl font-bold flex items-center">
        <span className="font-montserrat text-purple-700 tracking-tight">E</span>
        <span className="text-gray-800 tracking-wide">vent</span>
        <span className="font-serif text-purple-900 italic">i</span>
        <span className="text-gray-800 tracking-wide">fy</span>
        <span className="text-indigo-700 ml-1">Host</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        <Link to={`/dashboard/${host?._id}`} className='text-sm font-semibold'>Dashboard</Link>
        <Link to={`/list/events/${host?._id}`} className='text-sm font-semibold'>List Your Events</Link>
        <Link to="/create/v1/posters-and-thumbnails" className='text-sm font-semibold'>Design Posters</Link>
      </div>

      {/* User Profile / Login Options */}
      <div className="flex items-center gap-4 z-100">
        {host ? (
          <div className="relative flex items-center gap-2">
            {/* Profile Image */}
            <img
              src={userDetail?.avatar || "/default-pic.avif"}
              alt="UserImage"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setViewProfile((prev) => !prev)}
            />
            <span className='cursor-pointer font-medium hidden sm:flex'>
              Hi, {host?.name || "Guest"}
            </span>

            {/* Dropdown for Profile */}
            {viewProfile && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-12 w-72 bg-white shadow-lg rounded-md border border-gray-200 transition-all duration-300 ease-in-out"
              >
                <HostViewSlide />
              </div>
            )}
          </div>
        ) : (
          <div className='hidden lg:flex gap-4 items-center'>
            <Link to={`/login`} className='py-2 px-3 rounded hover:bg-purple-800 bg-purple-600 text-white font-medium text-sm'>Login</Link>
            <Link to={`/signup`} className='py-2 px-3 rounded hover:bg-gray-800 bg-black text-white font-medium text-sm'>Signup</Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} ref={menuRef}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4 px-6 transition-all duration-300 z-50 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <Link to={`/dashboard/${host?._id}`} className='block py-2 text-sm font-semibold'>Dashboard</Link>
        <Link to={`/list/events/${host?._id}`} className='block py-2 text-sm font-semibold'>List Your Events</Link>
        <Link to="/create/v1/posters-and-thumbnails" className='block py-2 text-sm font-semibold'>Design Posters</Link>

        {!host && (
          <div className='flex flex-col mt-4'>
            <Link to={`/login`} className='py-2 px-3 rounded bg-purple-600 text-white font-medium text-sm text-center'>Login</Link>
            <Link to={`/signup`} className='py-2 px-3 rounded bg-black text-white font-medium text-sm text-center mt-2'>Signup</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostNav;
