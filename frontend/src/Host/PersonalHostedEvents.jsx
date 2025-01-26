import { setLoading } from '@/redux/authSlice';
import { setUserEvents } from '../redux/eventSlice';
import { EVENT_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import PersonalEventCard from './PersonalEventCard';
import MenuBar from './MenuBar';
import Navbar from '../components/Navbar';
import HostNav from '@/main/HostNav';

const PersonalHostedEvents = () => {
    const dispatch = useDispatch();
    const { user, host } = useSelector((store) => store.auth);
    const { userEvents } = useSelector((store) => store.event);

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(`${EVENT_API_END_POINT}/list/events/${host._id}`, { withCredentials: true });
                if (response.data.success) {
                    dispatch(setLoading(false));
                    dispatch(setUserEvents(response.data.userEvents));
                    console.log(response.data.userEvents);
                }

            } catch (error) {
                dispatch(setLoading(false));
                console.log(error);
            }
        }
        fetchUserEvents();
    }, [host._id, dispatch])
    return (
        <>
        <HostNav/>
            <div className='font-montserrat p-6' >
                <h1 className='text-3xl font-bold p-3'>List of Your Hosted Events</h1>
                <div className='flex  items-center flex-wrap gap-14 p-5 px-24'>
                    {userEvents?.length <= 0 ? (
                        <p className="text-xl font-medium text-center w-full">No events available</p>
                    ) : (
                        userEvents?.map((event, idx) => (
                                <PersonalEventCard event={event} key={event._id} />
                        ))
                    )}
                </div>
            </div>
        </>

    )
}

export default PersonalHostedEvents
