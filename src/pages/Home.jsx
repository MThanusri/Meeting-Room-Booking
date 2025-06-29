import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms').then(res => setRooms(res.data));
    axios.get('http://localhost:5000/api/bookings').then(res => setBookings(res.data));
  }, []);

  const getAvailableSlots = (roomId) => {
    const slots = [
      '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
      '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
      '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
    ];

    const bookedSlots = bookings
      .filter(b => b.roomId === roomId)
      .map(b => `${b.startTime} - ${b.endTime}`);

    return slots.filter(s => !bookedSlots.includes(s));
  };

  const goToBookingPage = (roomId) => {
    localStorage.setItem('selectedRoomId', roomId);
    navigate('/book');
  };

  return (
    <div className="home-container">
      <div className="home-header">
  <div>
    <h2 style={{ marginBottom: '0.3rem' }}>Welcome, {userName}</h2>
    <div style={{ marginTop: '0.5rem' }}>
      <p className="platform-description" style={{ fontSize: '1.1rem', fontWeight: '500', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
        Welcome to GrubGate's Meeting Room Booking System — your one-stop solution for seamless room reservations. Book with confidence, and collaborate efficiently. Designed for teams who value time, space, and productivity.
      </p>
    </div>
  </div>
</div>
      <div className="room-list">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            <h4>{room.name}</h4>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Equipment:</strong> {room.equipment.join(', ')}</p>
            <div className="slot-list">
              <strong>Available Slots:</strong>
              <ul>
                {getAvailableSlots(room._id).map((slot, idx) => (
                  <li key={idx}>{slot}</li>
                ))}
              </ul>
            </div>
            <button className="btn btn-outline-primary mt-2" onClick={() => goToBookingPage(room._id)}>
              Book This Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;