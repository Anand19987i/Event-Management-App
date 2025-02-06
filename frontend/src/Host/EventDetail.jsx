import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setEventDetail } from '../redux/eventSlice';
import axios from 'axios';
import { EVENT_API_END_POINT } from '../utils/constant';
import Navbar from '../components/Navbar';
import { FaLocationDot } from "react-icons/fa6";
import RelatedEvents from './Recommendation/RelatedEvents';

const EventDetail = () => {
    const { eventDetail, loading, error } = useSelector(store => store.event);
    const dispatch = useDispatch();
    const { eventTitle, eventId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!eventId) {
            console.error('Event ID is missing.');
            return;
        }

        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${EVENT_API_END_POINT}/details/${eventTitle}/${eventId}`, {
                    withCredentials: true,
                });

                if (response.data.success) {
                    dispatch(setEventDetail(response.data.eventDetail));
                } else {
                    console.error('API Response Error:', response.data.message);
                }
            } catch (error) {
                console.error('Error in fetchEventDetails:', error.message);
            }
        };

        fetchEventDetails();
    }, [eventId, dispatch]);

    if (loading) return <div>Loading event details...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Navbar />
            <div className="w-full font-montserrat">
                <div className="flex flex-col text-start mx-4 md:mx-64 shadow-sm py-3">
                    {/* Event Image */}
                    <img src={eventDetail.eventPoster} alt={eventDetail.eventTitle} className="w-full h-96 object-fill rounded-md shadow-md" />

                    {/* Event Title and Book Button */}
                    <div className="mx-3 mt-4 flex justify-between items-center">
                        <span className="text-3xl font-bold text-gray-800">{eventDetail.eventTitle}</span>
                        <button 
                            onClick={() => navigate(`/seat-selection/${eventId}`)} 
                            className="text-white px-6 py-3 mt-2 bg-pink-600 hover:bg-pink-700 font-semibold rounded transition duration-300"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Event Details */}
                    <div className="mx-3">
                        <span className="font-medium text-normal font-poppins text-gray-600">
                            {eventDetail.eventType} | 18yrs+ | Hindi
                        </span>
                    </div>
                    <div className='mt-3 mx-4 font-normal text-gray-900 flex gap-2 text-lg font-poppins'>
                        <span>Time: {eventDetail.startTime} - {eventDetail.endTime} <span>{eventDetail.endTimePeriod}</span></span>
                        <span> | {new Date(eventDetail.eventDate).toLocaleDateString()} | </span> 
                        <span className='flex items-center gap-1'>
                            <FaLocationDot className='text-green-700 text w-6 h-6' /> {eventDetail.eventLocation}
                        </span>
                        <span>{eventDetail.state}</span>
                        <p>|</p>
                        <span className='font-semibold'>{eventDetail.ticketPrice} <span className='text-sm'>onwards</span></span>
                    </div>

                    {/* About Section */}
                    <div className='flex justify-between items-center'>
                        <div className='mt-3 mx-3 w-1/2'>
                            <p className='text-md font-bold'>About</p>
                            <div className='text-sm font-poppins'>
                                {eventDetail.eventDescription ? eventDetail.eventDescription.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                )) : <span>Description is not available</span>}
                            </div>
                        </div>
                        <div>
                            <span className='font-bold text-xl p-4'>{eventDetail?.totalSeats - eventDetail?.bookedSeats?.length} Seats Available</span>
                        </div>
                    </div>
                </div>

                {/* Related Events */}
                <div className='p-3 ml-32'>
                    <RelatedEvents />
                </div>
            </div>
        </>
    );
};

export default EventDetail;
