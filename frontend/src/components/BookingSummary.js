import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BookingSummary() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const bookingDetails = state?.bookingDetails;

    if (!bookingDetails) {
        return (
            <div className="text-center">
                <p>No booking details found.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go Back to Booking
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-green-100 rounded-md max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Booking Confirmed!</h2>
            <p><strong>Name:</strong> {bookingDetails.name}</p>
            <p><strong>Contact:</strong> {bookingDetails.contact}</p>
            <p><strong>Date:</strong> {bookingDetails.date}</p>
            <p><strong>Time:</strong> {bookingDetails.time}</p>
            <p><strong>Guests:</strong> {bookingDetails.guests}</p>
            <button
                onClick={() => navigate('/')}
                className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Back to Home
            </button>
        </div>
    );
}

export default BookingSummary;
