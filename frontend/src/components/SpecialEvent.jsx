import useGetAllEvents from '../hooks/useGetAllEvents';
import SpecialEventCards from '../components/SpecialEventCards';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import Slider from 'react-slick'; // Import react-slick
import Navbar from './Navbar';

const SpecialEvent = () => {
    useGetAllEvents();
    const { events } = useSelector((store) => store.event);

    return (
      <>
      <Navbar/>
        <div className='font-montserrat p-6'>
            <div className='grid grid-cols-5'>
                {events.length <= 0 ? (
                    <p className="text-xl font-medium text-center">No events available</p>
                ) : (
                    events.map((event) => (
                        <div className="px-2 md:px-6" key={event._id}> {/* Adjust padding for different screen sizes */}
                            <Link to={`/details/${event.eventTitle.replace(/\s+/g, '-')}/${event._id}`}>
                                <SpecialEventCards event={event} />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
        </>
    );
};

export default SpecialEvent;
