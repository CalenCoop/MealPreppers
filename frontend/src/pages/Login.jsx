import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import newRequest from '../../utils/newRequest';
import '../css/Login.css';

export default function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  async function handleSubmit (e){
    e.preventDefault();
    setLoading(false)
    try{
      setLoading(true)
      const response = await newRequest.post("https://mealpreppers.onrender.com/login",{username, password})
      localStorage.setItem('currentUser', JSON.stringify(response.data))
      navigate('/home')
      window.location.reload()
    }catch(err){
      setLoading(false)
      if (err.response) {
        setMessage(err.response.data.message);
        console.log(message)
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
          {loading && <p> Loading... </p>}
          {message && <p>{message}</p>}
          <span><a href="/signup"> Dont have an account? Click here</a></span>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}