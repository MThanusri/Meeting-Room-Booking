import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/bookingpage.css';

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    roomId: '',
    title: '',
    attendees: '',
    equipment: [],
    date: '',
    startTime: '',
    endTime: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms').then(res => setRooms(res.data));
    axios.get('http://localhost:5000/api/bookings').then(res => setBookings(res.data));
  }, []);

  const validateTime = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const diff = (endTime - startTime) / (1000 * 60);
    return diff >= 30 && diff <= 240;
  };

  const handleEquipmentChange = (item) => {
    const updated = form.equipment.includes(item)
      ? form.equipment.filter(eq => eq !== item)
      : [...form.equipment, item];
    setForm({ ...form, equipment: updated });
  };

  const handleBooking = () => {
    const { startTime, endTime } = form;
    if (!validateTime(startTime, endTime)) {
      return alert('Booking duration must be between 30 minutes and 4 hours.');
    }

    const payload = {
      ...form,
      userName: localStorage.getItem('userName'),
      userEmail: localStorage.getItem('userEmail')
    };

    axios.post('http://localhost:5000/api/bookings', payload)
      .then(() => navigate('/home'))
      .catch(err => alert(err.response?.data?.message || 'Booking failed'));
  };

  const selectedRoom = rooms.find(r => r._id === form.roomId);

  return (
    <div className="booking-container">
      <div className="booking-form">
        <h3>Book a Room</h3>
        <select className="form-select mb-3" onChange={e => setForm({ ...form, roomId: e.target.value })}>
          <option value="">Select Room</option>
          {rooms.map(room => <option key={room._id} value={room._id}>{room.name}</option>)}
        </select>

        {selectedRoom && (
          <div className="mb-3">
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

        <input className="form-control mb-3" placeholder="Meeting Title" onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="form-control mb-3" type="number" placeholder="Attendees" onChange={e => setForm({ ...form, attendees: e.target.value })} />
        <input className="form-control mb-3" type="date" onChange={e => setForm({ ...form, date: e.target.value })} />

        <div className="d-flex gap-3 mb-3">
          <input
            className="form-control modern-time-input"
            type="time"
            onChange={e => setForm({ ...form, startTime: e.target.value })}
          />
          <input
            className="form-control modern-time-input"
            type="time"
            onChange={e => setForm({ ...form, endTime: e.target.value })}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleBooking}>Confirm Booking</button>
      </div>

      <div className="booking-timeline mt-4">
        <h5 className="text-center">Today's Bookings</h5>
        {bookings.filter(b => b.date === form.date).length === 0 && (
          <p className="text-center">No bookings for the selected date yet.</p>
        )}
        {bookings.filter(b => b.date === form.date).map(b => (
          <div key={b._id} className="timeline-entry">
            <strong>{b.title}</strong> — {b.startTime} to {b.endTime} ({b.userName})
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;
