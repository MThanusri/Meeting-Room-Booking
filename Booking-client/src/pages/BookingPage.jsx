// BookingPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/bookingpage.css';

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    roomId: '', title: '', attendees: '', equipment: [], date: '', startTime: '', endTime: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedRoomId = localStorage.getItem('selectedRoomId');
    const storedCapacity = localStorage.getItem('selectedRoomCapacity');
    const storedRoomName = localStorage.getItem('selectedRoomName');

    if (storedRoomId) {
      setForm(prev => ({ ...prev, roomId: storedRoomId }));
      axios.get('http://localhost:5000/api/rooms')
        .then(res => {
          const room = res.data.find(r => r._id === storedRoomId);
          if (room) {
            setRooms([room]);
          } else {
            setRooms([{ _id: storedRoomId, name: storedRoomName || 'Selected Room', capacity: parseInt(storedCapacity) || 0, equipment: [] }]);
          }
        });
    }

    axios.get('http://localhost:5000/api/bookings')
      .then(res => setBookings(res.data))
      .catch(err => console.error('Failed to fetch bookings:', err));
  }, []);

  const validateTime = (start, end) => {
    const s = new Date(`1970-01-01T${start}:00`);
    const e = new Date(`1970-01-01T${end}:00`);
    const diff = (e - s) / (1000 * 60);
    return diff >= 30 && diff <= 240;
  };

  const isOverlapping = () => {
    return bookings.some(b =>
      b.roomId === form.roomId &&
      b.date === form.date &&
      !(form.endTime <= b.startTime || form.startTime >= b.endTime)
    );
  };

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

    if (!validateTime(form.startTime, form.endTime)) {
      return alert('Booking must be between 30 minutes and 4 hours.');
    }

    if (isOverlapping()) {
      return alert('Selected time overlaps with an existing booking for this room.');
    }

    const payload = {
      ...form,
      userName: localStorage.getItem('userName') || 'User',
      userEmail: localStorage.getItem('userEmail') || 'test@example.com'
    };

    axios.post('http://localhost:5000/api/bookings', payload)
      .then(() => {
        alert('Booking successful!');
        axios.get('http://localhost:5000/api/bookings')
          .then(res => setBookings(res.data));
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
        <input
          className="form-control mb-3"
          type="date"
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <div className="d-flex gap-3 mb-3">
          <select
            className="form-select"
            value={form.startTime}
            onChange={e => setForm({ ...form, startTime: e.target.value })}
          >
            <option value="">Start Time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={form.endTime}
            onChange={e => setForm({ ...form, endTime: e.target.value })}
          >
            <option value="">End Time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary w-100" onClick={handleBooking}>Confirm Booking</button>
      </div>

      <div className="booking-timeline mt-4">
        <h5 className="text-center text-primary mb-3">📅 Today's Bookings</h5>
        {bookings.filter(b => b.date === form.date).length === 0 && <p className="text-center text-muted">No bookings yet.</p>}
        {bookings.filter(b => b.date === form.date).map(b => (
          <div key={b._id} className="timeline-entry p-2 mb-2 border rounded bg-light shadow-sm">
            <div className="fw-bold text-dark">{b.title}</div>
            <div className="text-secondary small">{b.startTime} to {b.endTime} — <em>{b.userName}</em></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;
