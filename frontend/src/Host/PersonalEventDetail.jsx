import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setEventDetail, setEventId } from "@/redux/eventSlice";
import axios from "axios";
import { EVENT_API_END_POINT } from "@/utils/constant";
import Navbar from "@/components/Navbar";
import { FaLocationDot } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { PenSquare } from "lucide-react";
import HostNav from "@/main/HostNav";

const PersonalEventDetail = () => {
    const { eventDetail, loading, error } = useSelector((store) => store.event);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const { eventTitle, eventId } = useParams();
    const navigate = useNavigate();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const formatEventDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", options);
    };

    const deleteEvent = async () => {
        try {
            const response = await axios.delete(`${EVENT_API_END_POINT}/delete/event/${eventId}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                navigate(`/list/events/${user._id}`);
            } else {
                console.error("Error deleting event:", response.data.message);
            }
        } catch (error) {
            console.error("Error in deleteEvent:", error.message);
        } finally {
            setDeleteModalVisible(false);
        }
    };

    useEffect(() => {
        if (!eventId) {
            console.error("Event ID is missing.");
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
                    console.error("API Response Error:", response.data.message);
                }
            } catch (error) {
                console.error("Error in fetchEventDetails:", error.message);
            }
        };

        fetchEventDetails();
    }, [eventId, dispatch]);

    if (loading) return <div className="text-center py-10">Loading event details...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <>
            <HostNav />
            <div className="w-full font-montserrat max-w-screen-lg mx-auto p-4 sm:p-6">
                <div className="text-start">
                    <img
                        src={eventDetail.eventPoster}
                        alt={eventDetail.eventTitle}
                        className="w-full h-60 sm:h-80 md:h-96 object-cover rounded-md shadow-md"
                    />
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-800">{eventDetail.eventTitle}</span>

                        <div className="flex gap-3 mt-3 sm:mt-0">
                            <Link to={`/edit/event/${eventId}`}>
                                <button className="flex items-center gap-1 text-sm text-white px-4 py-2 bg-indigo-700 font-medium rounded hover:bg-indigo-800 transition duration-300">
                                    <PenSquare className="h-4 w-4" /> Edit
                                </button>
                            </Link>

                            <button
                                onClick={() => setDeleteModalVisible(true)}
                                className="flex items-center gap-1 text-white text-sm px-4 py-2 bg-red-700 font-medium rounded hover:bg-red-800 transition duration-300"
                            >
                                <MdDelete /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="text-gray-600 mt-2 text-sm sm:text-base">
                        {eventDetail.eventType} | 18yrs+ | Hindi
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-gray-900 text-sm sm:text-lg">
                        <span>Time: {eventDetail.startTime} - {eventDetail.endTime} {eventDetail.endTimePeriod}</span>
                        <span>| {formatEventDate(eventDetail.eventDate)} |</span>
                        <span className="flex items-center gap-1">
                            <FaLocationDot className="text-green-700 w-5 h-5" /> {eventDetail.eventLocation}
                        </span>
                        <span>{eventDetail.state}</span>
                        <span>|</span>
                        <span className="font-semibold">₹{eventDetail.ticketPrice} <span className="text-sm">onwards</span></span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6">
                        <div className="w-full sm:w-2/3">
                            <p className="text-lg font-bold">About</p>
                            <div className="text-sm text-gray-700">
                                {eventDetail.eventDescription
                                    ? eventDetail.eventDescription.split("\n").map((paragraph, index) => (
                                          <p key={index}>{paragraph}</p>
                                      ))
                                    : <span>Description is not available</span>}
                            </div>
                        </div>

                        <div className="text-xl font-bold p-4 sm:text-2xl">
                            {eventDetail.totalSeats - (eventDetail.booked?.length || 0)} Seats Available
                        </div>

                        <Link to={`/no-of-bookings/${eventDetail._id}`} className="text-indigo-800 underline p-2">
                            No. of Booking
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal for Delete Confirmation */}
            {deleteModalVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-80 sm:w-96">
                        <h3 className="text-lg font-semibold mb-4 text-center">Are you sure you want to delete this event?</h3>
                        <div className="flex justify-between">
                            <button onClick={() => setDeleteModalVisible(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md w-1/2 mr-2">No</button>
                            <button onClick={deleteEvent} className="px-4 py-2 bg-red-600 text-white rounded-md w-1/2">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PersonalEventDetail;
