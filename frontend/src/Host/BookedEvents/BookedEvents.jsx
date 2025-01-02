import { setLoading } from '@/redux/authSlice';
import { EVENT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import MenuBar from '../MenuBar';
import Navbar from '@/components/Navbar';
import {  setBookedEvents } from '@/redux/eventSlice';
import BookedEventCard from './BookedEventCard';

const BookedEvents = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const { userEvents, bookedEvents } = useSelector((store) => store.event);

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
                console.log(error);
            }
        }
        fetchBookedEvents();
    }, [user._id, dispatch])
    return (
        <>
        <Navbar/>
        <MenuBar/>
            <div className='font-montserrat p-6' >
                <h1 className='text-3xl font-bold p-3'>List of Your Hosted Events</h1>
                <div className='flex  items-center flex-wrap gap-14 p-5 px-24'>
                    {bookedEvents.length <= 0 ? (
                        <p className="text-xl font-medium text-center w-full">No events available</p>
                    ) : (
                        bookedEvents.map((event, idx) => (
                                <BookedEventCard event={event} key={event._id} />
                        ))
                    )}
                </div>
            </div>
        </>

    )
}

export default BookedEvents
