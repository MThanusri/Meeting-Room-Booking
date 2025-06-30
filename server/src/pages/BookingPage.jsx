// BookingPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/bookingpage.css';

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomId: '', title: '', attendees: '', equipment: [], date: '', startTime: '', endTime: ''
  });

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedRoomId = localStorage.getItem('selectedRoomId');
    const storedCapacity = localStorage.getItem('selectedRoomCapacity');
    const storedRoomName = localStorage.getItem('selectedRoomName');
    const storedStart = localStorage.getItem('startTime');
    const storedEnd = localStorage.getItem('endTime');

    setForm(prev => ({
      ...prev,
      roomId: storedRoomId,
      date: today,
      startTime: storedStart || '',
      endTime: storedEnd || ''
    }));

    axios.get('http://localhost:5000/api/rooms')
      .then(res => {
        const room = res.data.find(r => r._id === storedRoomId);
        if (room) {
          setRooms([room]);
        } else {
          setRooms([{ _id: storedRoomId, name: storedRoomName || 'Selected Room', capacity: parseInt(storedCapacity) || 0, equipment: [] }]);
        }
      });
  }, []);

  const handleEquipmentChange = (item) => {
    const updated = form.equipment.includes(item)
      ? form.equipment.filter(eq => eq !== item)
      : [...form.equipment, item];
    setForm({ ...form, equipment: updated });
  };

  const handleBooking = () => {
    const maxCapacity = parseInt(localStorage.getItem('selectedRoomCapacity') || '0');
    if (parseInt(form.attendees) > maxCapacity) {
      return alert(`Attendees should not exceed the room's capacity of ${maxCapacity} people.`);
    }

    const payload = {
      ...form,
      userName: localStorage.getItem('userName') || 'User',
      userEmail: userEmail || 'test@example.com'
    };

    axios.post('http://localhost:5000/api/bookings', payload)
      .then(() => {
        alert('Booking successful!');
        navigate('/home');
      })
      .catch(err => alert(err.response?.data?.message || 'Booking failed'));
  };

  const selectedRoom = rooms.find(r => r._id === form.roomId);

  return (
    <div className="booking-container">
      <div className="booking-form">
        <h3>Book a Room</h3>

        {selectedRoom && (
          <div className="mb-3">
            <p><strong>Room:</strong> {selectedRoom.name}</p>
            <p><strong>Capacity:</strong> {selectedRoom.capacity} people</p>
            {selectedRoom.equipment.length > 0 && (
              <div>
                <label><strong>Select Equipment:</strong></label>
                <div className="form-check">
                  {selectedRoom.equipment.map(eq => (
                    <div key={eq}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={eq}
                        onChange={() => handleEquipmentChange(eq)}
                        checked={form.equipment.includes(eq)}
                      />
                      <label className="form-check-label" htmlFor={eq}>{eq}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <input
          className="form-control mb-3"
          placeholder="Meeting Title"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="form-control mb-3"
          type="number"
          placeholder="Attendees"
          onChange={e => setForm({ ...form, attendees: e.target.value })}
        />

        <p className="text-muted">Booking for: {form.date}, {form.startTime} to {form.endTime}</p>

        <button className="btn btn-primary w-100" onClick={handleBooking}>Confirm Booking</button>
      </div>
    </div>
  );
};

export default BookingPage;
