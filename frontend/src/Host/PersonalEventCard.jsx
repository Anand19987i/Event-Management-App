import { User } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PersonalEventCard = ({ event }) => {
  const { user } = useSelector((store) => store.auth);
  const { eventId } = useSelector((store) => store.event);

  return (
    <div className="font-montserrat">
      {/* Card Container */}
      <div className="group flex flex-col w-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer mb-10">
        {/* Event Thumbnail */}
        <Link
          to={`/details/v1/events/${event.eventTitle
            ?.replace(/\s+/g, "-")
            .toLowerCase()}/${event?._id}`}
        >
          <img
            src={event.eventThumbnail}
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
        </div>
      </div>
    </div>
  );
};

export default PersonalEventCard;
