import React from "react";

const HeroSection = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-900 to-black text-white"
    >
      <div className="text-center max-w-5xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Host Your Own Event <br /> or Create Something Unforgettable
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90">
          Empower yourself to design, host, and manage unique events with ease. EventifyHost is here to turn your ideas into reality.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 hover:bg-indigo-100 transition-transform duration-300">
            Create Event
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-white hover:text-indigo-700 transition-transform duration-300">
            Manage Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
