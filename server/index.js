import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Room, Booking } from './schema.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/meeting-room')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});


app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch {
    res.status(400).json({ error: 'Failed to create booking' });
  }
});
// Add this in your Express backend (server/index.js)
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.userEmail !== email) {
      return res.status(403).json({ error: 'You can only delete your own bookings' });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
