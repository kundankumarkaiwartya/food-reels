import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import './feed.css'; // Reuse existing sleek card styles
import { Star, Clock } from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [partnerFoodCards, setPartnerFoodCards] = useState([]);
    const [activeTab, setActiveTab] = useState('reels'); // 'reels' or 'menu'

    useEffect(() => {
        // Fetch partner profile data
        axios.get(`http://localhost:3000/api/foodpartner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodpartner);
            })
            .catch(error => {
                console.log(error);
            });

        // Fetch food cards and filter for this specific partner
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3000/api/food/getfoodcard', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
                .then(response => {
                    const allCards = response.data.foodCard || [];
                    // Filter where nested foodpartnerId matches this page's id
                    const partnerCards = allCards.filter(item =>
                        item.foodpartnerId && item.foodpartnerId._id === id
                    );
                    setPartnerFoodCards(partnerCards);
                })
                .catch(console.error);
        }
    }, [id]);

    if (!profile) {
        return <div style={{ color: "white", padding: "20px" }}>Loading profile...</div>;
    }

    // Protect against missing 'reels' in backend data
    const reels = profile.reels || [];

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-image-wrapper">
                    {/* Access properties via the 'profile' state variable */}
                    <img src={profile.profileImg} alt={profile.name} className="profile-img" />
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">{profile.name}</h1>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">{profile.reelsCount || reels.length}</span>
                            <span className="stat-label">Reels</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{partnerFoodCards.length}</span>
                            <span className="stat-label">Menu Items</span>
                        </div>
                    </div>
                    <div className="profile-service">
                        <h3>Services Provided</h3>
                        <p>{profile.serviceOffered}</p>
                    </div>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', borderBottom: '1px solid #333', marginBottom: '20px', marginTop: '20px' }}>
                <button
                    onClick={() => setActiveTab('reels')}
                    style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: '15px 20px', fontSize: '15px', fontWeight: 'bold', transition: '0.3s',
                        color: activeTab === 'reels' ? 'var(--primary)' : '#888',
                        borderBottom: activeTab === 'reels' ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                >
                    Actual Reels
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: '15px 20px', fontSize: '15px', fontWeight: 'bold', transition: '0.3s',
                        color: activeTab === 'menu' ? 'var(--primary)' : '#888',
                        borderBottom: activeTab === 'menu' ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                >
                    Menu & Offerings 🍽️
                </button>
            </div>

            {/* ── Tab Content ── */}
            {activeTab === 'reels' && (
                <div className="reels-section" style={{ paddingTop: '10px' }}>
                    <div className="reels-grid">
                        {reels.map((reel) => (
                            <div key={reel._id} className="reel-card">
                                <video
                                    className="reel-thumbnail"
                                    src={reel.video}
                                    playsInline
                                    autoPlay
                                    muted
                                    loop
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                                <div className="reel-overlay">
                                    <span className="reel-views">▶ {reel.views || '1.2K'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <div className="food-grid" style={{ padding: '0 20px', paddingTop: '10px' }}>
                    {partnerFoodCards.length > 0 ? (
                        partnerFoodCards.map((item) => (
                            <div className="food-card" key={item._id} onClick={() => navigate(`/food/${item._id}`)}>
                                <div className="food-card-img-wrapper">
                                    <img src={item.image} alt={item.title} className="food-card-img" />
                                    {item.offer && <span className="offer-badge">{item.offer}</span>}
                                </div>
                                <div className="food-card-info">
                                    <div className="card-title-row">
                                        <h3 className="food-card-title">{item.title}</h3>
                                        <div className="rating-badge"><Star size={12} fill="#fff" /><span>{item.rating || '4.0'}</span></div>
                                    </div>
                                    <p className="food-card-desc" style={{ WebkitLineClamp: 2 }}>{item.description}</p>
                                    <div className="card-meta-row">
                                        <span className="food-card-price">₹{item.price}</span>
                                        <span className="meta-dot">•</span>
                                        <span className="delivery-time"><Clock size={13} /> {item.deliveryTime || '30 mins'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                            <p>No food items available from this partner yet.</p>
                        </div>
                    )}
                </div>
            )}

            <div style={{ height: '50px' }}> {/* Bottom spacer */} </div>
        </div>
    );
};

export default Profile;