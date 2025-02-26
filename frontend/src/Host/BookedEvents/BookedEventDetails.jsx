import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setEventDetail } from '@/redux/eventSlice';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import Navbar from '@/components/Navbar';
import { FaLocationDot } from "react-icons/fa6";

const BookedEventDetails = () => {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const { eventDetail, loading, error } = useSelector(store => store.event);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState(null);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setEventDetail(null));
        if (!eventId) return;

        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${EVENT_API_END_POINT}/details/${eventId}`, { withCredentials: true });
                if (response.data.success) {
                    dispatch(setEventDetail(response.data.eventDetail));
                } else {
                    console.error('API Response Error:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching event details:', error.message);
            }
        };

        fetchEventDetails();
    }, [eventId, dispatch]);

    const formatEventDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const cancelBooking = async () => {
        if (!eventId || !user?._id) {
            setCancelError("Invalid request: Missing event or user.");
            return;
        }

        setCancelLoading(true);
        setCancelError(null);

        try {
            const response = await axios.post(
                `${EVENT_API_END_POINT}/cancel-booking/${eventId}`,
                { userId: user?._id, selectedSeats: eventDetail?.bookedSeats || [] },
                { withCredentials: true }
            );

            if (response.data.success) {
                alert("Booking canceled successfully!");
                dispatch(setEventDetail(response.data.updatedEvent));
                navigate(`/list/bookings/events/${user?._id}`);
            } else {
                setCancelError(response.data.message || "Failed to cancel booking.");
            }
        } catch (error) {
            setCancelError("An error occurred while canceling the booking.");
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) return <div className="text-center text-xl">Loading event details...</div>;
    if (error) return <div className="text-center text-xl text-red-600">Error: {error}</div>;
    if (!eventDetail) return <div className="text-center text-xl">No event details available.</div>;

    return (
        <>
            <Navbar />
            <div className="w-full font-montserrat px-4 sm:px-8 md:px-16 lg:px-32 py-6">
                {/* Event Image */}
                <div className="w-full">
                    <img
                        src={eventDetail?.eventPoster}
                        alt={eventDetail?.eventTitle}
                        className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-md shadow-md"
                    />
                </div>

                {/* Event Title & Cancel Button */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">
                        {eventDetail?.eventTitle}
                    </h1>
                    <button
                        onClick={cancelBooking}
                        disabled={cancelLoading}
                        className="text-white px-6 py-3 w-full sm:w-auto font-semibold rounded bg-red-600 hover:bg-red-700 transition duration-300"
                    >
                        {cancelLoading ? 'Canceling...' : 'Cancel Booking'}
                    </button>
                </div>

                {/* Event Info */}
                <div className="mt-3 text-center sm:text-left">
                    <p className="font-medium text-gray-600 text-sm md:text-base">
                        {eventDetail.eventType} | 18yrs+ | Hindi
                    </p>
                </div>

                {/* Event Timing & Location */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center sm:text-left text-sm md:text-lg">
                    <span className="flex items-center justify-center sm:justify-start gap-1">
                        🕒 {eventDetail.startTime} - {eventDetail.endTime} {eventDetail.endTimePeriod}
                    </span>
                    <span>| {formatEventDate(eventDetail.eventDate)} |</span>
                    <span className="flex items-center justify-center sm:justify-start gap-1">
                        <FaLocationDot className="text-green-700 w-5 h-5" />
                        {eventDetail.eventLocation}, {eventDetail.state}
                    </span>
                    <span className="font-semibold text-lg text-indigo-700">
                        ₹ {eventDetail.ticketPrice} <span className="text-sm text-gray-500">onwards</span>
                    </span>
                </div>

                {/* About Section */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between">
                    <div className="w-full sm:w-3/5">
                        <h2 className="text-lg font-bold mb-2">About</h2>
                        <div className="text-sm md:text-base">
                            {eventDetail.eventDescription
                                ? eventDetail.eventDescription.split("\n").map((paragraph, index) => (
                                    <p key={index} className="mb-2">{paragraph}</p>
                                ))
                                : <span>Description is not available</span>}
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:w-2/5 text-center sm:text-right">
                        <p className="font-bold text-lg sm:text-xl">
                            {eventDetail.totalSeats - (eventDetail.bookedSeats?.length || 0)} Seats Available
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookedEventDetails;
