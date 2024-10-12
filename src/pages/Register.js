import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        email,
        username,
        password,
      });
      console.log('User registered:', response.data);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className='register-section container'>
      <h1>Register</h1>
      <input
        placeholder='Email Address'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button>I have an account</button>
    </div>
  );
}

export default Register;
