import React from "react";
import { Link } from "react-router-dom";

const HeroSectionUser = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white"
    >
      <div className="text-center max-w-5xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Discover Events That Inspire <br /> and Make Moments Unforgettable
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90">
          Explore exciting events, connect with like-minded people, and create memories that last forever—all with Eventify.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/view/events" className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 hover:bg-purple-100 transition-transform duration-300">
            Explore Events
          </Link>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-white hover:text-purple-700 transition-transform duration-300">
            Join an Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionUser;
