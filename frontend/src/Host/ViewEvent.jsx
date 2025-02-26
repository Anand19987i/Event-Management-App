import useGetAllEvents from "@/hooks/useGetAllEvents";
import SpecialEventCards from "@/components/SpecialEventCards";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Slider from "react-slick";

// Import Slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Next Arrow Component
const NextArrow = ({ onClick }) => (
  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer" onClick={onClick}>
    <MdOutlineNavigateNext className="w-10 h-10 bg-black opacity-70 hover:opacity-90 text-white p-2 rounded-full" />
  </div>
);

// Previous Arrow Component
const PreviousArrow = ({ onClick }) => (
  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer" onClick={onClick}>
    <GrFormPrevious className="w-10 h-10 bg-black opacity-70 hover:opacity-90 text-white p-2 rounded-full" />
  </div>
);

const ViewEvent = () => {
  useGetAllEvents();
  const { events } = useSelector((store) => store.event);

  // Check if events are available before rendering Slider
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-600">
          No events available 😞
        </p>
        <p className="text-gray-500 text-sm md:text-base mt-2">
          Please check back later for upcoming events.
        </p>
      </div>
    );
  }

  // Slider Settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
    centerMode: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024, // Tablets
        settings: { slidesToShow: 3, slidesToScroll: 1, centerMode: true },
      },
      {
        breakpoint: 768, // Mobile Landscape
        settings: { slidesToShow: 2, slidesToScroll: 1, centerMode: false },
      },
      {
        breakpoint: 480, // Small Mobile Screens
        settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: false },
      },
    ],
  };

  return (
    <div className="font-montserrat p-6">
      <h1 className="text-3xl sm:text-4xl font-bold pb-4 text-center md:text-left">
        Top Special Events
      </h1>
      <div className="relative">
        <Slider {...settings}>
          {events.slice(0, 6).map((event) => (
            <div className="px-2 sm:px-3 md:px-4 lg:px-6" key={event._id}>
              <Link to={`/details/${event.eventTitle.replace(/\s+/g, "-")}/${event._id}`}>
                <SpecialEventCards event={event} />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ViewEvent;
