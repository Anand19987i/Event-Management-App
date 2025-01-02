import { setEvents } from '../redux/eventSlice';
import { EVENT_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllEvents = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await axios.get(`${EVENT_API_END_POINT}/explore/events`,  {withCredentials: true});
                if (response.data.success) {
                    dispatch(setEvents(response.data.events));
                } else {
                    console.log("No events found.");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchAllEvents();
    }, [dispatch]);

    // You can return loading, error, or other states if needed
};

export default useGetAllEvents;
