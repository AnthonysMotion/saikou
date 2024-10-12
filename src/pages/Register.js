import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from '../components/card'; // Ensure this path is correct
import axios from 'axios';

function Register() {
  return (
    <div className='register-section container'>
        <h1>Register</h1>
        <input placeholder='Email Address'></input>
        <input placeholder='Username'></input>
        <input placeholder='Password' type='password'></input>
        <button>Register</button>
        <button>I have an account</button>
    </div>
  );
}

export default Register;
