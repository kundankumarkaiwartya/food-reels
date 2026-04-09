import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerRegister = () => {
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("https://food-reels-6se9.onrender.com/api/auth/foodpartner/register", {
      name,
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
      <div className="auth-card" style={{ padding: '2rem' }}>
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="auth-title">Become a Partner</h1>
          <p className="auth-subtitle">Grow your business with us</p>
        </div>
        <form className="auth-form" onSubmit={handlesubmit} style={{ gap: '1rem' }}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="restaurant-name">Restaurant Name</label>
            <input className="auth-input" type="text" name="name" id="restaurant-name" placeholder="Tasty Bites" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Business Email</label>
            <input className="auth-input" type="email" name="email" id="email" placeholder="contact@restaurant.com" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input className="auth-input" type="password" name="password" id="password" placeholder="••••••••" />
          </div>
          <button className="auth-button" type="submit" style={{ marginTop: '0' }}>Become a Partner</button>
        </form>
        <div className="auth-footer" style={{ marginTop: '1rem' }}>
          Already a partner? <Link to="/foodpartner/login" className="auth-link">Log in</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          Looking to order food? <Link to="/user/register" className="auth-link">User Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
