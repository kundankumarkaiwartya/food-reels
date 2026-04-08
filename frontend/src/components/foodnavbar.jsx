import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import '../styles/navbar.css';
import { Building2, PlusCircle, User } from 'lucide-react';

const FoodNavbar = () => {
    const location = useLocation();

    return (
        <nav className="bottom-navbar">
            <Link to="/create-food" className={`nav-item ${location.pathname === '/create-food' ? 'active' : ''} action-link`}>
                <PlusCircle size={32} className="plus-icon" />
                <span>Upload</span>
            </Link>

            <Link to="/store" className={`nav-item ${location.pathname === '/store' ? 'active' : ''}`}>
                <User size={24} />
                <span>Store</span>
            </Link>

            <Link to="/bussiness-profile" className={`nav-item ${location.pathname === '/bussiness-profile' ? 'active' : ''}`}>
                <Building2 size={24} />
                <span>Profile</span>
            </Link>
        </nav>
    )
}

export default FoodNavbar;
