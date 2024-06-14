const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/travelBooking', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const bookingSchema = new mongoose.Schema({
    type: String,
    fromCity: String,
    toCity: String,
    departureDate: Date,
    returnDate: Date,
    cabinClass: String,
    adults: Number,
    children: Number,
    city: String,
    checkinDate: Date,
    checkoutDate: Date,
    rooms: Number,
    pickupDate: Date,
    pickupTime: String,
    bookingDetails: mongoose.Schema.Types.Mixed // Store API response data
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
app.post('/book', async (req, res) => {
    const { type, ...bookingData } = req.body;

    try {
        let apiResponse;
        if (type === 'flight') {
            apiResponse = await axios.post('https://external-flight-api.com/search', bookingData);
        } else if (type === 'hotel') {
            apiResponse = await axios.post('https://external-hotel-api.com/search', bookingData);
        } else if (type === 'cab') {
            apiResponse = await axios.post('https://external-cab-api.com/search', bookingData);
        }

        if (apiResponse && apiResponse.data.success) {
            const booking = new Booking({ ...bookingData, bookingDetails: apiResponse.data.data });
            await booking.save();
            res.status(201).send({ success: true, data: apiResponse.data.data }); // Send API response data to the frontend
        } else {
            res.status(400).send({ success: false, message: 'Booking failed with external API' });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
