import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import AvailabilityDisplay from './components/AvailabilityDisplay';
import BookingSummary from './components/BookingSummary';
import axios from 'axios';

function App() {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (selectedDate) {
                try {
                    const response = await axios.get(`http://localhost:5000/get-available-slots?date=${selectedDate}`);
                    setAvailableSlots(response.data.availableSlots);
                } catch (error) {
                    console.error('Error fetching available slots:', error);
                }
            }
        };

        fetchAvailableSlots();
    }, [selectedDate]);

    // Add a date input field or another way to trigger setSelectedDate
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value); // Set the selected date
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Restaurant Booking System</h1>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="max-w-4xl mx-auto space-y-6">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange} // Handle date change
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <BookingForm availableSlots={availableSlots} />
                                <AvailabilityDisplay date={selectedDate} />
                            </div>
                        }
                    />
                    <Route path="/confirmation" element={<BookingSummary />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
