import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        date: '',
        time: '',
        guests: ''
    });
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (formData.date) {
                try {
                    const response = await axios.get(`http://localhost:5000/get-available-slots?date=${formData.date}`);
                    setAvailableSlots(response.data.availableSlots);
                } catch (error) {
                    console.error('Error fetching available slots:', error);
                }
            }
        };

        fetchAvailableSlots();
    }, [formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/create-booking', formData);
            alert(response.data.message);
            // Redirect to confirmation page with booking details
            navigate('/confirmation', { state: { bookingDetails: formData } });
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded-md">
            <input
                className="w-full p-2 border border-gray-300 rounded"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                className="w-full p-2 border border-gray-300 rounded"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                required
            />
            <input
                className="w-full p-2 border border-gray-300 rounded"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
            {/* Time Slot Selector */}
            <select
                className="w-full p-2 border border-gray-300 rounded"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
            >
                <option value="">Select a time slot</option>
                {/* Populate available time slots dynamically */}
                {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                ))}
            </select>
            <input
                className="w-full p-2 border border-gray-300 rounded"
                type="number"
                name="guests"
                placeholder="Guests"
                value={formData.guests}
                onChange={handleChange}
                required
            />
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Book</button>
        </form>
    );
}

export default BookingForm;
