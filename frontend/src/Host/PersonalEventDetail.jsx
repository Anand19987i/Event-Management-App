import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setEventDetail, setEventId } from '@/redux/eventSlice';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import Navbar from '@/components/Navbar';
import { FaLocationDot } from "react-icons/fa6";
import { MdDelete } from 'react-icons/md';
import { PenSquare } from 'lucide-react';
import HostNav from '@/main/HostNav';


const PersonalEventDetail = () => {
    const { eventDetail, loading, error } = useSelector(store => store.event);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { eventTitle, eventId } = useParams();
    const navigate = useNavigate();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const formatEventDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const deleteEvent = async () => {
        try {
            const response = await axios.delete(`${EVENT_API_END_POINT}/delete/event/${eventId}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                navigate(`/list/events/${user._id}`);
            } else {
                console.error('Error deleting event:', response.data.message);
            }
        } catch (error) {
            console.error('Error in deleteEvent:', error.message);
        } finally {
            setDeleteModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false); 
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
                    dispatch(setEventId(eventId));
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
            <HostNav />
            <div className="w-full font-montserrat">
                <div className="flex flex-col text-start mx-4 md:mx-64 p-3">
                    <img src={eventDetail.eventPoster} alt={eventDetail.eventTitle} className="w-full h-96 object-fill rounded-md shadow-md" />
                    <div className="mx-3 mt-4 flex justify-between items-center">
                        <span className="text-3xl font-bold text-gray-800">{eventDetail.eventTitle}</span>

                        <div className='flex gap-2'>
                            <Link to={`/edit/event/${eventId}`}>
                                <button className="flex items-center gap-1 text-sm text-white px-5 py-3 mt-2 bg-indigo-700 font-medium rounded hover:bg-indigo-800 transition duration-300">
                                   <PenSquare className='h-4 w-4'/> Edit
                                </button>
                            </Link>

                            <button onClick={() => setDeleteModalVisible(true)} className="flex  items-center gap-1 text-white text-sm px-3 py-3 mt-2 bg-red-700 font-meduim rounded hover:bg-red-800 transition duration-300">
                                <MdDelete />Delete
                            </button>
                        </div>
                    </div>

                    <div className="mx-3">
                        <span className="font-medium text-normal font-poppins text-gray-600">
                            {eventDetail.eventType} | 18yrs+ | Hindi
                        </span>
                    </div>
                    <div className='mt-3 mx-4 font-normal font text-gray-900 flex gap-5 text-lg font-poppins'>
                        <span>Time: {eventDetail.startTime} - {eventDetail.endTime} <span>{eventDetail.endTimePeriod}</span></span>
                        <span> | {formatEventDate(eventDetail.eventDate)} | </span>
                        <span className='flex items-center gap-1'> <FaLocationDot className='text-green-700 text w-6 h-6' /> {eventDetail.eventLocation}</span>
                        <span>{eventDetail.state}</span>
                        <p>|</p>
                        <span className='font-semibold'>₹{eventDetail.ticketPrice} <span className='text-sm'>onwards</span></span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='mt-3 mx-3 w-1/2'>
                            <p className='text-md font-bold'>About</p>
                            {/* Render description with line breaks */}
                            <div className='text-sm font-poppins'>
                                {eventDetail.eventDescription ? eventDetail.eventDescription.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                )) : <span>Description is not available</span>}
                            </div>
                        </div>
                        <div>
                        <span className='font-bold text-xl p-4'>{eventDetail.totalSeats - eventDetail.booked?.length} Seats Available</span>
                        </div>
                        <Link to={`/no-of-bookings/${eventDetail._id}`} className="flex  text-indigo-800 underline p-2">No. of Booking</Link>
                    </div>
                </div>
            </div>

            {/* Modal for Delete Confirmation */}
            {deleteModalVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this event?</h3>
                        <div className="flex justify-between">
                            <button onClick={cancelDelete} className="px-4 py-2 bg-gray-500 text-white rounded-md">No</button>
                            <button onClick={deleteEvent} className="px-4 py-2 bg-red-600 text-white rounded-md">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
           
        </>
    );
};

export default PersonalEventDetail;
