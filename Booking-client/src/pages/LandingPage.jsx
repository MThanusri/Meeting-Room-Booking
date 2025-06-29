import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landingpage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });

  const handleContinue = () => {
    if (!form.name || !form.email) {
      alert('Please enter both name and email');
      return;
    }
    localStorage.setItem('userName', form.name);
    localStorage.setItem('userEmail', form.email);
    navigate('/home');
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <h1>Welcome to GrubGate's Meeting Room Booking System</h1>
        <p>Please enter your details to continue</p>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Your Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Your Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <button className="btn btn-primary w-100" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
