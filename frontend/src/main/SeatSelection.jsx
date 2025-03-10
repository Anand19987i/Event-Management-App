import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EVENT_API_END_POINT } from '../utils/constant';
import Navbar from '../components/Navbar';

const SeatSelection = () => {
    const { eventDetail, loading, error } = useSelector(store => store.event);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const eventId = eventDetail?._id;
    const [totalSeats, setTotalSeats] = useState(0);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(true);
    const [errorSeats, setErrorSeats] = useState("");
    const MAX_COLUMNS = 20;

    useEffect(() => {
        if (!eventId) return;

        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${EVENT_API_END_POINT}/${eventId}`);
                if (response.data.success) {
                    setTotalSeats(response.data.event.totalSeats);
                    setBookedSeats(response.data.event.bookedSeats);
                }
            } catch (error) {
                setErrorSeats("Failed to load event details");
            } finally {
                setLoadingSeats(false);
            }
        };
        fetchEventDetails();
    }, [eventId]);

    const toggleSeatSelection = (seat) => {
        setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
    };

    const handleConfirmBooking = async () => {
        try {
            const amount = selectedSeats.length * eventDetail.ticketPrice;
            const { data } = await axios.post(`${EVENT_API_END_POINT}/payment/razorpay`, {
                eventId,
                userId: user?._id,
                amount,
                selectedSeats,
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: `${eventDetail?.eventTitle}`,
                description: "Seat Booking Payment",
                order_id: data.order.id,
                handler: async (response) => {
                    await axios.post(`${EVENT_API_END_POINT}/payment/razorpay/callback`, {
                        ...response,
                        userId: user?._id,
                        eventId,
                        selectedSeats,
                    });
                    navigate(`/list/bookings/events/${user?._id}`);
                },
                theme: { color: "#3399cc" }
            };
            console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                console.error("Razorpay SDK is not loaded");
            }

        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    if (loadingSeats) return <div className="min-h-[400px] flex-center">Loading...</div>;

    const getSeatCategory = (seatNumber) => {
        if (seatNumber <= 10) return { category: "VVIP", color: "bg-gray-400 border-gray-500 text-white" };
        if (seatNumber <= 20) return { category: "VIP", color: "bg-gray-400 border-gray-500 text-white" };
        if (seatNumber <= 30) return { category: "Regular", color: "bg-gray-400 border-gray-500 text-white" };
        return { category: "General", color: "bg-gray-400 border-gray-500 text-white" };
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto p-4 space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Select Your Seats</h1>
                    <p className="text-gray-600">Choose your preferred seats</p>
                </header>

                {errorSeats && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
                        <span>{errorSeats}</span>
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mx-6">
                    <div className="overflow-x-auto pb-4">
                        <div className="inline-block mx-auto">
                            {Array.from({ length: Math.ceil(totalSeats / MAX_COLUMNS) }).map((_, row) => (
                                <div key={row} className="flex gap-2 mb-2">
                                    {Array.from({ length: MAX_COLUMNS }).map((_, col) => {
                                        const seatNumber = row * MAX_COLUMNS + col + 1;
                                        if (seatNumber > totalSeats) return null;

                                        const isBooked = bookedSeats.includes(seatNumber);
                                        const isSelected = selectedSeats.includes(seatNumber);
                                        const { category, color } = getSeatCategory(seatNumber);

                                        return (
                                            <button
                                                key={seatNumber}
                                                onClick={() => !isBooked && toggleSeatSelection(seatNumber)}
                                                disabled={isBooked}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 border-2 
                                                    ${isBooked ? "bg-gray-100 border-gray-200 cursor-not-allowed" :
                                                    isSelected ? `scale-90 ${color}` :
                                                    `hover:scale-105 border-blue-200 hover:bg-blue-50 ${color}`}
                                                `}
                                                title={`${category} Seat`}
                                            >
                                                {isSelected ? "✔" : seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-gray-600 text-center md:text-left">
                                Selected {selectedSeats.length} seat{selectedSeats.length !== 1 && "s"}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{(selectedSeats.length * eventDetail.ticketPrice).toLocaleString("en-IN")}
                            </p>
                        </div>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={!selectedSeats.length}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all
                                ${selectedSeats.length ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg" :
                                "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SeatSelection;
