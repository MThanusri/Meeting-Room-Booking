import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landingpage.css';

const LandingPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && email) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      navigate('/home');
    } else {
      alert('Please enter both name and email.');
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h4 className="landing-title">Meeting Room Booking</h4>
        <input
          type="text"
          className="form-control landing-input"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          className="form-control landing-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className="btn btn-primary landing-button" onClick={handleLogin}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LandingPage;