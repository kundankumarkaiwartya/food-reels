import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, ShoppingBag, Play } from 'lucide-react';
import '../styles/navbar.css';

const UserNavbar = () => {
    const location = useLocation();

    return (
        <nav className="bottom-navbar">
            <Link to="/feed" className={`nav-item ${location.pathname === '/feed' ? 'active' : ''}`}>
                <Home size={24} />
                <span>Home</span>
            </Link>

            <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
                <Play size={24} />
                <span>Reels</span>
            </Link>

            <Link to="/activeorders" className={`nav-item ${location.pathname === '/activeorders' ? 'active' : ''}`}>
                <ShoppingBag size={24} />
                <span>Orders</span>
            </Link>

            <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <User size={24} />
                <span>Profile</span>
            </Link>
        </nav>
    );
};

export default UserNavbar;