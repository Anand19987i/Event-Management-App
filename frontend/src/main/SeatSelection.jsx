import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import Navbar from '@/components/Navbar';
import dotenv from "dotenv";
dotenv.config();

const SeatSelection = () => {
    const { eventDetail } = useSelector(store => store.event);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const eventId = eventDetail?._id;
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(true);
    const [errorSeats, setErrorSeats] = useState("");

    const CATEGORY_MAPPING = [
        { name: "VVIP", range: [1, 10], color: "bg-red-600 border-red-700 text-white", price: 5000 },
        { name: "VIP", range: [11, 30], color: "bg-orange-500 border-orange-600 text-white", price: 3000 },
        { name: "Premium", range: [31, 50], color: "bg-green-500 border-green-600 text-white", price: 2000 },
        { name: "Regular", range: [51, 100], color: "bg-gray-400 border-gray-500 text-white", price: eventDetail?.ticketPrice }
    ];

    useEffect(() => {
        if (!eventId) return;
        axios.get(`${EVENT_API_END_POINT}/${eventId}`).then(response => {
            if (response.data.success) {
                setBookedSeats(response.data.event.bookedSeats);
            }
        }).catch(() => setErrorSeats("Failed to load event details"))
          .finally(() => setLoadingSeats(false));
    }, [eventId]);

    const toggleSeatSelection = (seat) => {
        setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
    };

    const getSeatPrice = (seatNumber) => {
        const category = CATEGORY_MAPPING.find(({ range }) => seatNumber >= range[0] && seatNumber <= range[1]);
        return category ? category.price : 0;
    };

    const handleConfirmBooking = async () => {
        try {
            const seatDetails = selectedSeats.map(seat => ({ seatNumber: seat, price: getSeatPrice(seat) }));
            const totalAmount = seatDetails.reduce((sum, seat) => sum + seat.price, 0);
            
            const { data } = await axios.post(`${EVENT_API_END_POINT}/payment/razorpay`, {
                eventId, 
                userId: user?._id, 
                amount: totalAmount, 
                selectedSeats: seatDetails
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: `${eventDetail?.eventTitle} Seat Booking`,
                description: "Seat Booking Payment",
                order_id: data.order.id,
                handler: async (response) => {
                    await axios.post(`${EVENT_API_END_POINT}/payment/razorpay/callback`, {
                        ...response, 
                        userId: user?._id, 
                        eventId, 
                        selectedSeats: seatDetails
                    });
                    navigate(`/list/bookings/events/${user?._id}`);
                },
                theme: { color: "#3399cc" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto p-4 space-y-8">
                <header className="text-center">
                    <h1 className="text-3xl font-bold">Select Your Seats</h1>
                </header>
                {errorSeats && <div className="bg-red-100 p-4 text-red-700 rounded">{errorSeats}</div>}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {CATEGORY_MAPPING.map(({ name, range, color, price }) => (
                        <div key={name} className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">{name} Seats - ₹{price}</h2>
                            <div className="grid grid-cols-10 gap-2">
                                {Array.from({ length: range[1] - range[0] + 1 }).map((_, index) => {
                                    const seatNumber = range[0] + index;
                                    const isBooked = bookedSeats.includes(seatNumber);
                                    const isSelected = selectedSeats.includes(seatNumber);
                                    return (
                                        <button
                                            key={seatNumber}
                                            onClick={() => !isBooked && toggleSeatSelection(seatNumber)}
                                            disabled={isBooked}
                                            className={`w-10 h-10 rounded text-sm font-medium border-2 transition-all ${
                                                isBooked ? "bg-gray-100 border-gray-200 cursor-not-allowed" :
                                                isSelected ? `scale-90 ${color}` :
                                                `hover:scale-105 border-blue-200 hover:bg-blue-50 ${color}`
                                            }`}
                                        >
                                            {isSelected ? "✔" : seatNumber}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p>Selected {selectedSeats.length} seat{selectedSeats.length !== 1 && "s"}</p>
                    <p className="text-2xl font-bold">₹{selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0).toLocaleString("en-IN")}</p>
                    <button
                        onClick={handleConfirmBooking}
                        disabled={!selectedSeats.length}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                            selectedSeats.length ? "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg" :
                            "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </>
    );
};
export default SeatSelection;
