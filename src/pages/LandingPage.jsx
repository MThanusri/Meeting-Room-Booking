import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="login-container">
      <h2>Welcome! Enter your details to book a meeting room</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleLogin}>Continue</button>
    </div>
  );
};

export default LandingPage;
