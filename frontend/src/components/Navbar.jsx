import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import Cities from './Cities';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewSlide from './ViewSlide';

const Navbar = () => {
  const [showAllCities, setShowAllCities] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const cityRef = useRef(null);
  const dropdownRef = useRef(null);
  const handleClickOutside = (e) => {
    if (cityRef.current && !cityRef.current.contains(e.target) && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowAllCities(false);
      setViewProfile(false);
    }
  };
  const { user, userDetail } = useSelector(store => store.auth);
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


      <div className="flex items-center gap-5">
        {user?._id && <div className="flex items-center" ref={cityRef}>
          <span className="cursor-pointer" onClick={() => setShowAllCities(!showAllCities)}>
            Mumbai
          </span>
          <MdKeyboardArrowDown className="cursor-pointer" />
          <div
            ref={dropdownRef}
            className={`absolute z-10 left-52 w-10/12 mt-10 transition-all duration-300 ease-in-out transform ${showAllCities ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
          >
            {showAllCities && <Cities />}
          </div>
        </div>
        }
        {
          user ? <div className="flex items-center gap-1">
            <img
              src={userDetail?.avatar || "/default-pic.avif"}
              alt="UserImage"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setViewProfile(!viewProfile)}
            />
            <span className='cursor-pointer font-medium flex gap-1'>Hi, {user?.name || <p>Guest</p>}</span>
            <div
              ref={dropdownRef}
              className={`absolute z-10 right-0 top-0 w-1/4 transition-all duration-300 ease-in-out transform ${viewProfile ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
              {viewProfile && <ViewSlide />}
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

export default Navbar;
