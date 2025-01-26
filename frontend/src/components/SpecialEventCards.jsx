import React from "react";

const SpecialEventCards = ({ event }) => {
  return (
    <div className="font-montserrat">
      {/* Card Container */}
      <div className="group flex flex-col w-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer mb-10">
        {/* Event Thumbnail */}
        <img
          src={event?.eventThumbnail}
          alt={event?.eventTitle}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Event Details */}
        <div className="p-4 space-y-2">
          {/* Event Title */}
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {event?.eventTitle}
          </h3>

          {/* Event Type */}
          <p className="text-sm text-gray-600">{event?.eventType || "Special Event"}</p>

          {/* Event Artist */}
          <p className="text-sm text-gray-500 truncate">
            {event?.eventArtist || "Unknown Artist"}
          </p>

          {/* Ticket Price */}
          <p className="text-sm font-medium text-indigo-700">
            ₹{event?.ticketPrice || "Free"} <span className="text-gray-500">onwards</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecialEventCards;
