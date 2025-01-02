import React from 'react';

const SpecialEventCards = ({ event }) => {
  return (
    <div className="font-montserrat">
      <div className="flex flex-col w-52 rounded-md cursor-pointer mb-10">
        <img
          src={event.eventThumbnail}
          alt={event.eventTitle}
          className="rounded-md w-full h-full object-cover"
        />
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
  );
};

export default SpecialEventCards;
