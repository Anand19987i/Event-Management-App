import SpecialEventCards from '@/components/SpecialEventCards';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import Slider from 'react-slick'; // Import react-slick
import RecommendEventCard from './RecommendEventCard';


const NextArrow = ({ onClick }) => (
    <div className="absolute top-1/3 right-0 transform -translate-y-1/2 z-10 cursor-pointer" onClick={onClick}>
        <MdOutlineNavigateNext className='w-10 h-10 bg-black opacity-60 text-white p-2 rounded-full' />
    </div>
);

const PreviousArrow = ({ onClick }) => (
    <div className="absolute top-1/3 left-0 transform -translate-y-1/2 z-10 cursor-pointer" onClick={onClick}>
        <GrFormPrevious className='w-10 h-10 bg-black opacity-60 text-white p-2 rounded-full' />
    </div>
);

const RecommendationModel = () => {

    const { recommendEvents } = useSelector((store) => store.event);
    const recommendedEvents = Array.isArray(recommendEvents) ? recommendEvents : [];
    console.log(recommendedEvents);
    const settings = {
        dots: false, // Disable dots (optional)
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Number of slides visible at once
        slidesToScroll: 1, // Scroll one slide at a time
        nextArrow: <NextArrow />, // Custom next arrow
        prevArrow: <PreviousArrow />, // Custom previous arrow
        centerMode: true, // Adds more central alignment
        focusOnSelect: true, // Allows selecting a slide when clicked
        responsive: [
            {
                breakpoint: 1024, // For tablets
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true
                }
            },
            {
                breakpoint: 600, // For mobile devices
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true
                }
            }
        ]
    };

    return (
        <div className='font-montserrat p-6'>
            <h1 className='text-3xl font-bold p-3'>Recommended Events</h1>
            <div className='relative'>
                {recommendedEvents.length <= 0 ? (
                    <p className="text-xl font-medium text-center w-full">No events available</p>
                ) : (
                    <Slider {...settings}>
                        {recommendedEvents.slice(0, 6).map((event, idx) => (
                            <div className="-px-44" key={idx}>
                                <Link key={event._id} to={`/details/${event.eventTitle ? event.eventTitle.replace(/\s+/g, '-') : 'default-title'}/${event._id}`}>
                                    <RecommendEventCard event={event} />
                                </Link>
                            </div>
                        ))}

                    </Slider>
                )}
            </div>
        </div>
    );
};

export default RecommendationModel;
