import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, LogOut, ChevronLeft } from 'lucide-react';
import './user.profile.css';
import axios from 'axios';

const Setting = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:3000/api/food/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            navigate('/user/login');
        }
    };

    return (
        <div className="profile-page" style={{
            minHeight: '100vh',
            backgroundColor: '#121212',
            color: '#fff',
            transition: 'all 0.3s ease'
        }}>
            <div className="profile-header-navigation" style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                <button
                    className="nav-round-btn"
                    onClick={() => navigate(-1)}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        boxShadow: 'none',
                        border: 'none'
                    }}
                >
                    <ChevronLeft size={20} color="#fff" />
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '18px', fontWeight: '600' }}>Settings ⚙️</h2>
                <div style={{ width: '40px' }}></div>
            </div>

            <div className="profile-content" style={{ padding: '0 20px' }}>

                {/* Account Details */}
                <div className="profile-info-card" style={{
                    marginTop: '20px',
                    backgroundColor: '#1a1a1a',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    borderRadius: '16px',
                    padding: '20px',
                    transition: 'all 0.3s ease'
                }}>
                    <h3 style={{ color: '#fff', fontSize: '15px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Information</h3>

                    {user ? (
                        <>
                            <div className="info-row" style={{ color: '#ccc', padding: '10px 0', borderBottom: '1px solid #333', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Mail size={18} />
                                <span style={{ fontSize: '15px' }}>{user.email}</span>
                            </div>
                            <div className="info-row" style={{ color: '#ccc', padding: '10px 0', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Phone size={18} />
                                <span style={{ fontSize: '15px' }}>{user.phoneNumber || '+91 - Not Added'}</span>
                            </div>
                        </>
                    ) : (
                        <p style={{ color: 'var(--primary)', margin: 0 }}>Loading details...</p>
                    )}
                </div>

                {/* Danger Zone */}
                <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '16px', borderRadius: '16px',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                        backgroundColor: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d',
                        border: '1px dashed rgba(255, 77, 77, 0.4)', cursor: 'pointer',
                        fontSize: '16px', fontWeight: '600', transition: 'all 0.2s'
                    }}>
                        <LogOut size={20} />
                        <span>Logout Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setting;
