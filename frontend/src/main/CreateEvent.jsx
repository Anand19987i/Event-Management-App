import React, { useState } from 'react';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLoading } from '@/redux/eventSlice';
import { Loader2 } from 'lucide-react';
import HostNav from './HostNav';
import MenuBar from '@/Host/MenuBar';

const CreateEvent = () => {
  const Cities = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
    "Kolkata", "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur",
    "Indore", "Thane", "Bhopal", "Visakhapatnam", "Vadodara", "Chandigarh",
    "Ranchi", "Guwahati", "Mysore", "Coimbatore", "Agra", "Varanasi",
    "Patna", "Raipur", "Nashik", "Jodhpur", "Madurai", "Meerut", "Rajkot",
    "Amritsar", "Allahabad", "Vijayawada", "Gwalior", "Noida", "Faridabad",
    "Ludhiana", "Ghaziabad", "Jabalpur", "Aurangabad", "Dehradun", "Shillong",
    "Kochi", "Trivandrum", "Pondicherry"
  ];

  const eventTypes = [
    "Concert",
    "Theater",
    "Workshop",
    "Seminar",
    "Exhibition",
    "Stand-up Comedy",
    "Music Festival",
    "Sports Event",
    "Webinar",
    "Art Showcase"
  ];
  const { user, host } = useSelector((store) => store.auth);
  const { loading } = useSelector((store) => store.event);
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventType: '',
    eventArtist: '',
    eventDescription: '',
    eventLocation: '',
    ticketPrice: '',
    state: '',
    eventDate: '',
    eventPoster: null,
    totalSeats: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "startTime" || name === "endTime") {
      const [hours, minutes] = value.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const formattedTime = `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setFormData({
        ...formData,
        [name]: formattedTime,
        [`${name}Period`]: period,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const data = new FormData();
      data.append("eventPoster", formData.eventPoster); // Append poster file
      data.append('eventTitle', formData.eventTitle);
      data.append('eventType', formData.eventType);
      data.append('eventArtist', formData.eventArtist);
      data.append('eventDescription', formData.eventDescription);
      data.append('eventLocation', formData.eventLocation);
      data.append('eventDate', formData.eventDate);
      data.append('ticketPrice', formData.ticketPrice);
      data.append('state', formData.state);
      data.append('startTime', formData.startTime);
      data.append('endTime', formData.endTime);
      data.append('startTimePeriod', formData.startTimePeriod);
      data.append('endTimePeriod', formData.endTimePeriod);
      data.append('totalSeats', formData.totalSeats);

      const response = await axios.post(
        `${EVENT_API_END_POINT}/host/event/${host?._id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setLoading(false));
        navigate(`/list/events/${host._id}`);
      }
      console.log('Event created:', response.data);
    } catch (error) {
      dispatch(setLoading(false));
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-montserrat">
      <HostNav />
      <div className=" mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Host Your Event</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Row 1 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                name="eventPoster"
                className="block w-full text-gray-700 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Title</label>
              <input
                type="text"
                name="eventTitle"
                placeholder="Event Title"
                value={formData.eventTitle}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Row 2 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Event Type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select an Event Type
                </option>
                {eventTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Host</label>
              <input
                type="text"
                name="eventArtist"
                placeholder="Event Host"
                value={formData.eventArtist}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="eventDescription"
                placeholder="Description"
                value={formData.eventDescription}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Ticket Price</label>
              <input
                type="text"
                name="ticketPrice"
                placeholder="Ticket Price"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Row 3 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">City</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select a City
                </option>
                {Cities.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input
                type="text"
                name="eventLocation"
                placeholder="Location"
                value={formData.eventLocation}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Date</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Time</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="flex-grow px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  name="startTimePeriod"
                  value={formData.startTimePeriod}
                  onChange={handleInputChange}
                  className="w-20 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">End Time</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="flex-grow px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  name="endTimePeriod"
                  value={formData.endTimePeriod}
                  onChange={handleInputChange}
                  className="w-20 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Total No. of Seats</label>
              <input
                type="text"
                name="totalSeats"
                placeholder="No. of Seats Available"
                value={formData.totalSeats}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>
          {loading ? (
            <button
              type="submit"
              className="bg-indigo-700 text-white py-3 px-6 rounded-2xl mx-auto my-5 flex items-center justify-center"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </button>
          ) : (
            <button
              type="submit"
              className=" flex bg-indigo-700 text-white px-6 py-3 rounded-2xl mx-auto my-5  "
            >
              Host Now
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
