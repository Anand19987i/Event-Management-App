import { EVENT_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RelatedEvents = () => {
    const { eventDetail } = useSelector((store) => store.event);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getRelatedEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${EVENT_API_END_POINT}/related/events/${eventDetail?.eventType}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setRelatedEvents(response.data.events);
                }
            } catch (error) {
                console.error('Error fetching related events:', error);
            } finally {
                setLoading(false);
            }
        };

        if (eventDetail?.eventType) getRelatedEvents();
    }, [eventDetail, eventDetail.eventType]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Related Events
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                </div>
            ) : relatedEvents.length <= 0 ? (
                <p className="text-center text-gray-600">No related events found</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {relatedEvents.map((event) => (
                        <Link
                            key={event._id}
                            to={`/details/${event.eventTitle}/${event._id}`}
                            className="group"
                        >
                            <img
                                src={event.eventPoster}
                                alt={event.eventTitle}
                                className="w-full h-40 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RelatedEvents;
