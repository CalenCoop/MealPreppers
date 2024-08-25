import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import newRequest from '../../utils/newRequest';
import '../css/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await newRequest.post("https://mealpreppers.onrender.com/login",{username, password})
      localStorage.setItem('currentUser', JSON.stringify(response.data))
      navigate('/home')
    }catch(err){
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage(err.message);
      }
    }
  }
    
  
  return (
    <div className="login-container">
      <h1>MealPreppers</h1>
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <span> Dont have an account? Click <a href="/signup">here</a></span>
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}