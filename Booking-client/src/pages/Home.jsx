import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(() => alert('Failed to load rooms'));
  }, []);

  const handleBook = (roomId, roomName, capacity) => {
  localStorage.setItem('selectedRoomId', roomId);
  localStorage.setItem('selectedRoomName', roomName);
  localStorage.setItem('selectedRoomCapacity', capacity);
  navigate('/book');
};


  return (
    <div className="home-wrapper">
      <div className="home-header">
        <h2>Welcome, {userName}</h2>
        <p>          Welcome to GrubGate's Meeting Room Booking System — your one-stop solution for seamless room reservations. Book with confidence, and collaborate efficiently.
</p>
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
    </div>
  );
};

export default Home;