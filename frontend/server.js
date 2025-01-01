const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path  = require('path');

const app = express();
const PORT = 5000;
const MONGO_URI='mongodb+srv://sandipsannake:0LId7t6wekGvpha0@cluster0.hio6r.mongodb.net/Table-slot-Booking-DB'


// Middleware
app.use(cors());
app.use(bodyParser.json());


const _dirname = path.resolve()

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Booking Schema and Model
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Controllers
const bookingController = {
    createBooking: async (req, res) => {
        const { name, contact, date, time, guests } = req.body;
        if (!name || !contact || !date || !time || !guests) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        try {
            const isSlotTaken = await Booking.exists({ date, time });
            if (isSlotTaken) {
                return res.status(400).json({ message: 'Time slot already booked.' });
            }

            const newBooking = new Booking({ name, contact, date, time, guests });
            await newBooking.save();
            res.status(201).json({ message: 'Booking created successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error creating booking.', error });
        }
    },

    getBookings: async (req, res) => {
        try {
            const bookings = await Booking.find();
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching bookings.', error });
        }
    },

    deleteBooking: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await Booking.findByIdAndDelete(id);
            if (!result) {
                return res.status(404).json({ message: 'Booking not found.' });
            }
            res.json({ message: 'Booking deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting booking.', error });
        }
    }
};

// Controller method to get available time slots for a given date
const getAvailableTimeSlots = async (req, res) => {
    const { date } = req.query;

    // Define your time slots (for example)
    const allTimeSlots = [
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    try {
        // Get all bookings for the given date
        const bookings = await Booking.find({ date });

        // Get booked time slots for the selected date
        const bookedSlots = bookings.map(booking => booking.time);

        // Filter out booked slots from all available slots
        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        res.json({ availableSlots });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available slots.', error });
    }
};

// Add the route to the Express app
app.get('/get-available-slots', getAvailableTimeSlots);
// Routes
app.post('/create-booking', bookingController.createBooking);
app.get('/get-bookings', bookingController.getBookings);
app.delete('/delete-booking/:id', bookingController.deleteBooking);



app.use(express.static(path.join(_dirname,"/frontend/build")))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","build","index.html"))
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});