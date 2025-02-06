import React, { useEffect, useState } from "react";
import axios from "axios";
import { EVENT_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import HostNav from "./HostNav";

const BookedEventDetail = () => {
  const [bookedUsers, setBookedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventDetail } = useSelector((store) => store.event);

  useEffect(() => {
    const fetchBookedUsers = async () => {
      if (!eventDetail._id) {
        setError("Event ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${EVENT_API_END_POINT}/no-of-bookings/${eventDetail?._id}`);
        if (response.data.success) {
          setBookedUsers(response.data.bookedUsers);
        } else {
          setError(response.data.message || "Failed to fetch booked users.");
        }
      } catch (err) {
        setError("An error occurred while fetching booked users.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedUsers();
  }, [eventDetail._id]);

  if (loading) {
    return <div className="flex justify-center items-center py-6 text-lg font-medium text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 bg-red-100 p-4 rounded-lg shadow-md">{error}</div>;
  }

  return (
    <>
      <HostNav />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Event Booking Overview Section */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-xl">
          <h1 className="text-3xl font-semibold text-black mb-4">{eventDetail.eventTitle} - Booking Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Total Bookings</h2>
              <p className="text-3xl font-bold">{bookedUsers.length}</p>
            </div>
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Total Revenue</h2>
              <p className="text-3xl font-bold">₹{bookedUsers.length * eventDetail.ticketPrice}</p>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Seats Remaining</h2>
              <p className="text-3xl font-bold">{eventDetail.totalSeats - bookedUsers.length}</p>
            </div>
          </div>
        </div>

        {/* Booked Users Table Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-black mb-4">Booked Users</h2>
          {bookedUsers.length === 0 ? (
            <div className="text-gray-600">No users have booked this event yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto border-collapse shadow-md rounded-lg">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Firstname</th>
                    <th className="px-6 py-4 text-left">Lastname</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 border-b border-gray-200">{user?.userId?.firstname}</td>
                      <td className="px-6 py-4 border-b border-gray-200">{user?.userId?.lastname}</td>
                      <td className="px-6 py-4 border-b border-gray-200">{user?.userId?.email}</td>
                      <td className="px-6 py-4 border-b border-gray-200">{user?.userId?.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookedEventDetail;
