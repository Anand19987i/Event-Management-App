import { User } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PersonalEventCard = ({ event }) => {

    const [isVisible, setVisible] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { eventId } = useSelector(store => store.event);

    const togglePopover = () => {
        setVisible(!isVisible);
    }

    return (
        <div className="font-montserrat">
            <div className="flex flex-col w-52 rounded-md cursor-pointer mb-10" >
                <Link to={`/details/v1/events/${event.eventTitle?.replace(/\s+/g, '-')}/${event?._id}`} >
                    <img
                        src={event.eventThumbnail}
                        alt={event.eventTitle}
                        className="rounded-md w-full h-full object-cover"
                    />
                </Link>
                <p className='font-medium'>
                    {event?.eventTitle.length > 10
                        ? `${event.eventTitle.slice(0, 20)}...`
                        : event.eventTitle}
                </p>
                <span className="text-gray-600">{event?.eventType}</span>
                <span className="text-gray-500">{event?.eventArtist.slice(0, 20)}...</span>
                <span className="text-gray-500">{event.ticketPrice} onwards</span>
                
            </div>

        </div>
    )
}

export default PersonalEventCard
