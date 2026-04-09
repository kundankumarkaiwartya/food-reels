import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PartnerLogin = () => {
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("https://food-reels-6se9.onrender.com/api/auth/foodpartner/login", {
      email,
      password
    }, { withCredentials: true })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "foodpartner");
      localStorage.setItem("user", JSON.stringify(response.data.foodpartner));
    }

    navigate("/create-food");
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Partner Portal</h1>
          <p className="auth-subtitle">Login to your food partner account</p>
        </div>
        <form className="auth-form" onSubmit={handlesubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Business Email</label>
            <input className="auth-input" name="email" type="email" id="email" placeholder="contact@restaurant.com" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input className="auth-input" name="password" type="password" id="password" placeholder="••••••••" />
          </div>
          <button className="auth-button" type="submit">Access Dashboard</button>
        </form>
        <div className="auth-footer">
          New to Food Reels? <Link to="/foodpartner/register" className="auth-link">Register your business</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          Looking to order food? <Link to="/user/login" className="auth-link">User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
