import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/user/login", {
        email,
        password
      }, { withCredentials: true });

      // Save token from the response!
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", "user");
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      navigate("/feed");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed. Please check your network connection.");
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Login to your user account</p>
        </div>
        <form className="auth-form" onSubmit={handlesubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input className="auth-input" type="email" name="email" id="email" placeholder="name@example.com" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input className="auth-input" type="password" name="password" id="password" placeholder="••••••••" />
          </div>
          <button className="auth-button" type="submit">Sign in</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/user/register" className="auth-link">Sign up</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          Are you a food partner? <Link to="/foodpartner/login" className="auth-link">Partner Login</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
