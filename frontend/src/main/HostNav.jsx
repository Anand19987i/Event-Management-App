import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewSlide from '@/components/ViewSlide';
import HostViewSlide from './HostViewSlide';

const HostNav = () => {
  const [showAllCities, setShowAllCities] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const cityRef = useRef(null);
  const dropdownRef = useRef(null);
  const handleClickOutside = (e) => {
    // Close dropdown if clicked outside the dropdown or avatar
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      cityRef.current &&
      !cityRef.current.contains(e.target)
    ) {
      setViewProfile(false);
      setShowAllCities(false);
    }
  };

  const { host, userDetail } = useSelector(store => store.auth);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-20 h-20 font-montserrat shadow-md">
      <Link to="/host/main" className='text-xl font-semibold'><span className='font-semibold font-montserrat'>E</span>vent<span className='text-purple -900 font-bold font-serif'>i</span>fy
      <span className='text-indigo-700'>Host</span></Link>
      <div className="flex items-center gap-5">
        {
          host ? <div className="flex items-center gap-1">
            <div className='flex gap-3'>
              <Link to={`/list/events/${host._id}`} className='text-sm font-semibold'>List Your Events</Link>
              <Link to="/create/v1/posters-and-thumbnails" className='text-sm font-semibold'>Design Thumbnails</Link>
            </div>
            <img
              src={userDetail?.avatar || "/default-pic.avif"}
              alt="UserImage"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setViewProfile((prev) => !prev)}
              ref={cityRef}
            />
            <span className='cursor-pointer font-medium flex gap-1'>Hi, {host?.name || <p>Guest</p>}</span>
            <div
              ref={dropdownRef}
              className={`absolute z-10 right-0 top-0 w-1/4 transition-all duration-300 ease-in-out transform ${viewProfile ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
              {viewProfile && <HostViewSlide />}
            </div>
          </div> : <div className='flex gap-4 items-center'>
          <Link to={`/login`} className='py-2 px-3 rounded hover:bg-purple-800 bg-purple-600 text-white font-medium text-sm'>Login</Link>
          <Link to={`/signup`} className='py-2 px-3 rounded hover:bg-gray-800 bg-black text-white font-medium text-sm'>Signup</Link>
          </div>
        }
      </div>
    </div>
  );
};

export default HostNav;
