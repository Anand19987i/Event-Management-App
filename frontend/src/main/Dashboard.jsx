import React, { useEffect, useState } from "react";
import HostNav from "./HostNav";
import { useSelector } from "react-redux";
import axios from "axios";
import { EVENT_API_END_POINT, HOST_API_END_POINT } from "@/utils/constant";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { host } = useSelector((store) => store.auth);
    const [eventData, setEventData] = useState([]);
    const [hostData, setHostData] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${EVENT_API_END_POINT}/dashboard/${host?._id}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setEventData(response.data.events);
                }
            } catch (error) {
                console.log("Error in getting Dashboard Data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [host?._id]);

    useEffect(() => {
        const fetchHostData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${HOST_API_END_POINT}/hostdata/dashboard/${host?._id}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setHostData(response.data.hostDetails);
                }
            } catch (error) {
                console.log("Error in getting Dashboard Data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHostData();
    }, [host?._id]);

    return (
        <>
            <HostNav />
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                {/* Statistics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Events */}
                    <div className="bg-indigo-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <div className="flex items-center gap-4">
                            <i className="fas fa-calendar-alt text-4xl"></i>
                            <span className="text-lg sm:text-xl font-semibold">Total Events</span>
                        </div>
                        <p className="mt-4 text-2xl sm:text-3xl font-bold">{hostData?.hostedEvents?.length || 0}</p>
                    </div>

                    {/* Tickets Sold */}
                    <div className="bg-gray-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <div className="flex items-center gap-4">
                            <i className="fa-solid fa-ticket text-4xl"></i>
                            <span className="text-lg sm:text-xl font-semibold">Tickets Sold</span>
                        </div>
                        <p className="mt-4 text-2xl sm:text-3xl font-bold">{hostData?.allTimeTicketSold || 0}</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <div className="flex items-center gap-4">
                            <i className="fa-solid fa-indian-rupee-sign text-4xl"></i>
                            <span className="text-lg sm:text-xl font-semibold">Total Revenue</span>
                        </div>
                        <p className="mt-4 text-2xl sm:text-3xl font-bold">₹ {hostData?.allTimeRevenue || 0}</p>
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Event Details</h2>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading data...</p>
                    ) : eventData?.length === 0 ? (
                        <p className="text-center text-gray-500">No Event Data Found</p>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="px-3 sm:px-4 py-2 border-b">Event Title</th>
                                    <th className="px-3 sm:px-4 py-2 border-b">Total Bookings</th>
                                    <th className="px-3 sm:px-4 py-2 border-b">Revenue</th>
                                    <th className="px-3 sm:px-4 py-2 border-b">Tickets Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventData.map((event) => (
                                    <tr key={event?._id} className="hover:bg-gray-100 transition-all">
                                        <td className="px-3 sm:px-4 py-2 border-b">
                                            <Link
                                                to={`/details/v1/events/${event.eventTitle
                                                    ?.replace(/\s+/g, "-")
                                                    .toLowerCase()}/${event?._id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {event?.eventTitle}
                                            </Link>
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 border-b">{event?.booked?.length || 0}</td>
                                        <td className="px-3 sm:px-4 py-2 border-b">
                                            ₹ {event?.ticketPrice * (event?.booked?.length || 0)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 border-b">{event?.booked?.length || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
