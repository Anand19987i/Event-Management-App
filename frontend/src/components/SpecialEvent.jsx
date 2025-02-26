import useGetAllEvents from "@/hooks/useGetAllEvents";
import SpecialEventCards from "@/components/SpecialEventCards";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const SpecialEvent = () => {
  useGetAllEvents();
  const { events } = useSelector((store) => store.event);

  return (
    <>
      <Navbar />
      <div className="font-montserrat p-4 sm:p-6 md:p-8 lg:p-10 ml-8">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-600">
              No events available 😞
            </p>
            <p className="text-gray-500 text-sm md:text-base mt-2">
              Please check back later for upcoming events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {events.map((event) => (
              <div key={event._id} className="px-2">
                <Link
                  to={`/details/${event.eventTitle.replace(/\s+/g, "-")}/${event._id}`}
                  className="block transition-transform transform hover:scale-105"
                >
                  <SpecialEventCards event={event} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SpecialEvent;
