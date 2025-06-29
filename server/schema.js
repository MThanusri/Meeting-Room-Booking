import mongoose from 'mongoose';

// Room Schema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  equipment: { type: [String], required: true }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  title: { type: String, required: true },
  attendees: { type: Number, required: true },
  equipment: { type: [String] },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true }
});

export const Room = mongoose.model('Room', roomSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
