import { User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BookedEventCard = ({ event }) => {
  return (
    <div className="font-montserrat">
      {/* Card Container */}
      <div className="group flex flex-col w-80 lg:w-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer mb-10">
        {/* Event Thumbnail */}
        <Link to={`/booked/event/details/${event._id}`}>

          <img
            src={event.eventPoster}
            alt={event.eventTitle}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Event Info */}
        <div className="p-4 space-y-2">
          {/* Event Title */}
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {event?.eventTitle}
          </h3>

          {/* Event Type */}
          <p className="text-sm text-gray-600">
            {event?.eventType || "General Event"}
          </p>

          {/* Artist */}
          <p className="text-sm text-gray-500 truncate">
            <User className="inline-block w-4 h-4 mr-1 text-gray-500" />
            {event?.eventArtist || "Unknown Artist"}
          </p>

          {/* Ticket Price */}
          <p className="text-sm font-medium text-indigo-700">
            ₹{event.ticketPrice || "Free"} <span className="text-gray-500">onwards</span>
          </p>

          {/* Booking Badge */}
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            Booked
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookedEventCard;
