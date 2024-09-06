import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../css/SignUp.css';

export default function SignupForm() {
    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = React.useState('');
    const navigate = useNavigate()

    function handleChange(e){
        setUser((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        if (user.password !== confirmPassword) {
            console.log('passwords do not match')
            return
        }
        try {
            const response = await axios.post('https://mealpreppers.onrender.com/register', { ...user }, { withCredentials: true });
            if (response.status === 200) {
                localStorage.setItem('currentUser', JSON.stringify(response.data))
                navigate('/home');
                window.location.reload()
            } else {
                console.error('Registration failed:', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('Registration failed:', error.response.data.message);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };

    return (
        <div className="signup-container">
            <h1>MealPreppers</h1>
            <div className="signup-form">
                <h2>Create a New Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">User Name</label>
                        <input 
                            name="username"
                            type="text"  
                            placeholder='TestApp' 
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input 
                            name="email"
                            type="text"
                            placeholder='TestAcc@Test.com'
                            id="email"
                            onChange={handleChange} 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            name="password"
                            type="password" 
                            id="password"
                            placeholder='Password'
                            onChange={handleChange} 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            name="confirmPassword"
                            type="password"
                            id="confirmPassword" 
                            placeholder='Password'
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-button">Submit</button>
                </form>
            </div>
        </div>
    );
}