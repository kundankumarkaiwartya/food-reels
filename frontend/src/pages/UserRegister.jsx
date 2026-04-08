import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();


    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:3000/api/auth/user/register", {
      fullName,
      email,
      password
    },
      { withCredentials: true }
    )
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    navigate("/feed");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Sign up as a user to order food</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">Full Name</label>
            <input className="auth-input" type="text" id="name" name="fullName" placeholder="John Doe" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input className="auth-input" type="email" id="email" name="email" placeholder="name@example.com" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input className="auth-input" type="password" id="password" name="password" placeholder="••••••••" />
          </div>
          <button className="auth-button" type="submit">Sign up</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/user/login" className="auth-link">Log in</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          Want to become a partner? <Link to="/foodpartner/register" className="auth-link">Partner Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
