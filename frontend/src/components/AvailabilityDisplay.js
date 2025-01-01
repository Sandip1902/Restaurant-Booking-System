import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AvailabilityDisplay({ date }) {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-available-slots?date=${date}`);
                setAvailableSlots(response.data.availableSlots);
            } catch (error) {
                setError('Error fetching available slots.');
                console.error(error);
            }
        };

        if (date) fetchAvailableSlots();
    }, [date]);

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold">Available Slots on {date}</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="mt-2">
                {availableSlots.length === 0 ? (
                    <li>No available slots for this date.</li>
                ) : (
                    availableSlots.map((slot) => (
                        <li key={slot} className="p-2 border-b border-gray-200">
                            <button className="text-blue-500 hover:text-blue-700">{slot}</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default AvailabilityDisplay;
