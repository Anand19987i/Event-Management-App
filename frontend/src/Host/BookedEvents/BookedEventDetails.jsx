import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setEventDetail } from '@/redux/eventSlice';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import Navbar from '@/components/Navbar';
import { FaLocationDot } from "react-icons/fa6";

const BookedEventDetails = () => {
    const { eventDetail, checkBooked, loading, error } = useSelector(store => store.event);
    const dispatch = useDispatch();
    const { eventTitle, eventId } = useParams();

    const formatEventDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
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

    if (loading) return <div className="text-center text-xl">Loading event details...</div>;
    if (error) return <div className="text-center text-xl text-red-600">Error: {error}</div>;

    return (
        <>
            <Navbar />
            <div className="w-full font-montserrat">
                <div className="flex flex-col text-start mx-4 sm:mx-8 md:mx-32 lg:mx-64  p-3">
                    {/* Event Image */}
                    <img
                        src={eventDetail.eventPoster}
                        alt={eventDetail.eventTitle}
                        className="w-full h-96 object-fill rounded-md shadow-md"
                    />

                    {/* Event Title and Book Button */}
                    <div className="mx-3 mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-start">
                            {eventDetail.eventTitle}
                        </span>
                        {checkBooked ? (
                            <button className="text-white px-6 py-3 mt-2 sm:mt-0 font-semibold rounded bg-gray-600 hover:bg-gray-800 transition duration-300">
                                Booked
                            </button>
                        ) : (
                            <button className="text-white px-6 py-3 mt-2 sm:mt-0 font-semibold rounded bg-pink-600 hover:bg-pink-700 transition duration-300">
                                Book
                            </button>
                        )}
                    </div>

                    {/* Event Details */}
                    <div className="mx-3 mt-2 text-center sm:text-start">
                        <span className="font-medium text-gray-600 text-sm md:text-base">
                            {eventDetail.eventType} | 18yrs+ | Hindi
                        </span>
                    </div>

                    <div className="mt-3 mx-4 font-normal text-gray-900 flex flex-col sm:flex-row sm:gap-4 md:gap-6 text-center sm:text-start text-sm md:text-lg">
                        <span>
                            Time: {eventDetail.startTime} - {eventDetail.endTime}{" "}
                            <span>{eventDetail.endTimePeriod}</span>
                        </span>
                        <span>| {formatEventDate(eventDetail.eventDate)} |</span>
                        <span className="flex items-center justify-center sm:justify-start gap-1">
                            <FaLocationDot className="text-green-700 w-5 h-5" />{" "}
                            {eventDetail.eventLocation}
                        </span>
                        <span>{eventDetail.state}</span>
                        <span>|</span>
                        <span className="font-semibold">
                            {eventDetail.ticketPrice} <span className="text-sm">onwards</span>
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 mx-3">
                        <div className="w-full sm:w-1/2">
                            <p className="text-md font-bold mb-2">About</p>
                            <div className="text-sm md:text-base font-poppins">
                                {eventDetail.eventDescription ? (
                                    eventDetail.eventDescription
                                        .split("\n")
                                        .map((paragraph, index) => (
                                            <p key={index} className="mb-2">
                                                {paragraph}
                                            </p>
                                        ))
                                ) : (
                                    <span>Description is not available</span>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span className="font-bold text-lg sm:text-xl p-4">
                                {eventDetail.totalSeats - eventDetail.booked?.length} Seats Available
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookedEventDetails;
