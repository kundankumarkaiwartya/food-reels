import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Settings,
    LogOut,
    ChevronRight,
    Star,
    ShoppingBag,
    ShoppingCart,
    Edit2,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import './user.profile.css';
import axios from 'axios';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/user/login');
                    return;
                }

                const response = await axios.get('https://food-reels-6se9.onrender.com/api/food/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data.user);
                setOrderCount(response.data.orderCount);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Profile Error:", err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
                if (err.response?.status === 401) {
                    navigate('/user/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const profileSections = [
        { icon: <ShoppingBag size={20} />, label: 'My Orders', path: '/activeorders' },
        { icon: <ShoppingCart size={20} />, label: 'My Cart', path: '/favourites' },
        { icon: <MapPin size={20} />, label: 'Saved Addresses', path: '/address' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/setting' },
    ];

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loader"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* ── Top Header Navigation ── */}
            <div className="profile-header-navigation">
                <button className="nav-round-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <button className="nav-round-btn">
                    <Edit2 size={18} />
                </button>
            </div>

            {/* ── User Meta Section ── */}
            <div className="profile-hero">
                <div className="avatar-wrapper">
                    {user.profilePic ? (
                        <img src={user.profilePic} alt={user.fullName} />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.fullName?.charAt(0)}
                        </div>
                    )}
                </div>
                <h1 className="profile-name">{user.fullName}</h1>
                <div className="profile-joined">
                    <Calendar size={14} />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
            </div>




            {/* ── Action List ── */}
            <div className="profile-content">
                <div className="action-group">
                    {profileSections.map((section, index) => (
                        <div
                            className="action-item"
                            key={index}
                            onClick={() => section.path !== '#' && navigate(section.path)}
                        >
                            <div className="action-icon-bg">
                                {section.icon}
                            </div>
                            <span className="action-label">{section.label}</span>
                            <ChevronRight size={18} className="chevron" />
                        </div>
                    ))}
                </div>

                {/* Contact and Logout have been moved to the Settings page ⚙️ */}

                <p className="app-version">Version 1.0.2 • Made with ❤️</p>
            </div>
        </div>
    );
};

export default UserProfile;
