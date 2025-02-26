import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setEventDetail } from '@/redux/eventSlice';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import Navbar from '@/components/Navbar';
import { FaLocationDot } from "react-icons/fa6";
import RelatedEvents from './Recommendation/RelatedEvents';

const EventDetail = () => {
    const { eventDetail, loading, error } = useSelector(store => store.event);
    const dispatch = useDispatch();
    const { eventTitle, eventId } = useParams();
    const navigate = useNavigate();

    // Format Event Date
    const formatEventDate = (dateString) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

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

    if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading event details...</div>;
    if (error) return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

    return (
        <>
            <Navbar />
            <div className="w-full font-montserrat px-4 sm:px-8 md:px-16 lg:px-32 py-6">
                <div className="flex flex-col shadow-sm p-4 md:p-6 bg-white rounded-lg">
                    {/* Event Image */}
                    <img 
                        src={eventDetail.eventPoster} 
                        alt={eventDetail.eventTitle} 
                        className="w-full h-84 sm:h-80 md:h-96 object-fit rounded-md shadow-md"
                    />

                    {/* Event Title & Book Button */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-start">{eventDetail.eventTitle}</span>
                        <button 
                            onClick={() => navigate(`/seat-selection/${eventId}`)} 
                            className="mt-4 sm:mt-0 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded transition duration-300"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Event Details */}
                    <div className="text-center sm:text-start text-gray-600 mt-2 text-sm sm:text-base">
                        {eventDetail.eventType} | 18yrs+ | Hindi
                    </div>

                    {/* Event Information */}
                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center text-lg text-gray-900 font-poppins gap-2 sm:gap-4">
                        <span>🕒 {eventDetail.startTime} - {eventDetail.endTime} {eventDetail.endTimePeriod}</span>
                        <span>| 📅 {formatEventDate(eventDetail.eventDate)} |</span> 
                        <span className="flex items-center gap-1">
                            <FaLocationDot className="text-green-700 w-6 h-6" /> {eventDetail.eventLocation}
                        </span>
                        <span>| {eventDetail.state} |</span>
                        <span className="font-semibold text-indigo-700">₹{eventDetail.ticketPrice} <span className="text-sm text-gray-600">onwards</span></span>
                    </div>

                    {/* About Section */}
                    <div className="mt-6 flex flex-col md:flex-row justify-between items-start">
                        <div className="w-full md:w-2/3">
                            <p className="text-lg font-bold mb-2">About</p>
                            <div className="text-sm text-gray-700">
                                {eventDetail.eventDescription 
                                    ? eventDetail.eventDescription.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-2">{paragraph}</p>
                                    )) 
                                    : <span className="text-gray-500">Description is not available</span>
                                }
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 mt-4 md:mt-0 text-center md:text-end">
                            <span className="font-bold text-lg p-4 bg-gray-100 rounded-lg shadow-md">
                                🎟 {eventDetail.totalSeats - eventDetail.bookedSeats?.length} Seats Available
                            </span>
                        </div>
                    </div>
                </div>

                {/* Related Events */}
                <div className="mt-8">
                    <RelatedEvents />
                </div>
            </div>
        </>
    );
};

export default EventDetail;
