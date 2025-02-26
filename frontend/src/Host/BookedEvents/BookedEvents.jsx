import { setLoading } from '@/redux/authSlice';
import { EVENT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import { setBookedEvents } from '@/redux/eventSlice';
import BookedEventCard from './BookedEventCard';

const BookedEvents = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const { bookedEvents } = useSelector((store) => store.event);

    useEffect(() => {
        const fetchBookedEvents = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(`${EVENT_API_END_POINT}/list/booked/events/${user._id}`, { withCredentials: true });
                if (response.data.success) {
                    dispatch(setLoading(false));
                    dispatch(setBookedEvents(response.data.bookedEvents));
                }
            } catch (error) {
                dispatch(setLoading(false));
                console.error(error);
            }
        };
        fetchBookedEvents();
    }, [user._id, dispatch]);

    return (
        <>
            <Navbar />
            <div className="font-montserrat px-2 sm:px-4 md:px-6 lg:px-8 py-6">
                <h1 className="text-3xl font-bold text-center sm:text-left mb-6">List of Your Booked Events</h1>

                {bookedEvents.length === 0 ? (
                    <p className="text-xl font-medium text-center text-gray-600">No events available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full ml-10 lg:ml-0">
                        {bookedEvents.map((event, idx) => (
                            <BookedEventCard event={event} key={idx} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default BookedEvents;
