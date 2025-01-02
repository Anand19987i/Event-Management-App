import useGetAllEvents from '../hooks/useGetAllEvents';
import SpecialEventCards from '../components/SpecialEventCards';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const ViewEvent = () => {
    useGetAllEvents();
    const { events } = useSelector((store) => store.event);
    return (
        <div className='font-montserrat p-6' >
            <h1 className='text-3xl font-bold p-3'>Top Special Events</h1>
           <div className='flex  items-center flex-wrap gap-14 p-5 px-24'>
                {events.length <= 0 ? (
                    <p className="text-xl font-medium text-center w-full">No events available</p>
                ) : (
                    events.map((event, idx) => (
                        <Link  to={`/details/${event.eventTitle.replace(/\s+/g, '-')}/${event?._id}`} key={event?._id}>
                            <SpecialEventCards  event={event} />
                        </Link>
                        
                    ))
                )}
            </div>
   
        </div>
    );
};

export default ViewEvent;
