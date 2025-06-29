// Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css';

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(() => alert('Failed to load rooms'));

    axios.get('http://localhost:5000/api/bookings')
      .then(res => setBookings(res.data))
      .catch(() => alert('Failed to load bookings'));
  }, []);

  const handleBook = (roomId, roomName, capacity) => {
    if (!startTime || !endTime) {
      alert('Please select both start and end time slots');
      return;
    }
    localStorage.setItem('selectedRoomId', roomId);
    localStorage.setItem('selectedRoomName', roomName);
    localStorage.setItem('selectedRoomCapacity', capacity);
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('endTime', endTime);
    navigate('/book');
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/bookings/${id}?email=${userEmail}`)
      .then(() => {
        alert('Booking deleted successfully');
        setBookings(prev => prev.filter(b => b._id !== id));
      })
      .catch(() => alert('Failed to delete booking'));
  };

  const today = new Date().toISOString().split('T')[0];
  const userBookings = bookings.filter(b => b.userEmail === userEmail && b.date === today);

  return (
    <div className="home-wrapper">
      <div className="home-header">
        <h2>Welcome, {userName}</h2>
        <p>
          Welcome to GrubGate's Meeting Room Booking System — your one-stop solution for seamless room reservations. Book with confidence, and collaborate efficiently.
        </p>
        <div className="d-flex gap-3 mb-4">
          <select className="form-select" value={startTime} onChange={e => setStartTime(e.target.value)}>
            <option value="">Select Start Time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select className="form-select" value={endTime} onChange={e => setEndTime(e.target.value)}>
            <option value="">Select End Time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="room-grid">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            <h4>{room.name}</h4>
            <p><strong>Capacity:</strong> {room.capacity} people</p>
            <p><strong>Equipment:</strong> {room.equipment.join(', ')}</p>
            <button
              className="btn btn-outline-primary"
              onClick={() => handleBook(room._id, room.name, room.capacity)}
            >
              Book This Room
            </button>
          </div>
        ))}
      </div>

      <div className="booking-timeline mt-5">
        <h5 className="text-center text-primary mb-3">📋 Your Bookings for Today</h5>
        {userBookings.length === 0 && <p className="text-center text-muted">No bookings yet.</p>}
        {userBookings.map(b => (
          <div key={b._id} className="timeline-entry p-2 mb-2 border rounded bg-light shadow-sm">
            <div className="fw-bold">{b.title}</div>
            <div className="text-secondary small">
              {b.startTime} to {b.endTime} — <em>{b.roomId}</em>
            </div>
            <button className="btn btn-sm btn-danger mt-1" onClick={() => handleDelete(b._id)}>Cancel Booking</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
