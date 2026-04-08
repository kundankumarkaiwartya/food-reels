import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Search, SlidersHorizontal, Star, Clock, ShoppingCart, ChevronRight } from 'lucide-react';
import './feed.css';

const categories = [
    { emoji: '🍕', label: 'Pizza' },
    { emoji: '🍔', label: 'Burgers' },
    { emoji: '🍛', label: 'North Indian' },
    { emoji: '🍣', label: 'Sushi' },
    { emoji: '🌮', label: 'Wraps' },
    { emoji: '🥞', label: 'Breakfast' },
    { emoji: '🍰', label: 'Desserts' },
    { emoji: '🍜', label: 'Chinese' },
    { emoji: '🥗', label: 'Salads' },
];

const Feed = () => {
    const navigate = useNavigate();
    const [foodCards, setFoodCards] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    useEffect(() => {
        const fetchFoodCards = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/food/getfoodcard?search=${searchQuery}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                setFoodCards(response.data.foodCard || []);

                // Fetch user cart to highlight added items
                if (token) {
                    try {
                        const cartRes = await axios.get("http://localhost:3000/api/food/cart", {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true
                        });
                        setUserCart((cartRes.data.cart || []).map(c => c._id));
                    } catch (e) {
                        console.error("Could not fetch cart");
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching food cards:", err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchFoodCards();
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    if (loading) {
        return (
            <div className="feed-loading">
                <div className="loader"></div>
                <p>Curating the best dishes for you...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feed-error">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }
    const handleToggleCart = async (e, foodCardId) => {
        e.stopPropagation(); // Prevents clicking the card from redirecting you

        // Optimistic UI Update (Change color instantly)
        if (userCart.includes(foodCardId)) {
            setUserCart(prev => prev.filter(id => id !== foodCardId));
        } else {
            setUserCart(prev => [...prev, foodCardId]);
        }
        try {
            await axios.post("http://localhost:3000/api/food/cart", { foodCardId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                withCredentials: true
            });
        } catch (err) {
            console.error("Failed to update cart");
        }
    };

    return (
        <div className="feed-page">
            {/* ── Hero / Search Header ── */}
            <div className="feed-hero">
                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1 className="hero-title">
                        {getGreeting()}, <span className="hero-wave">👋</span>
                    </h1>
                    <p className="hero-subtitle">What are you craving today?</p>
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for dishes, restaurants..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="filter-btn">
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Category Chips ── */}
            <div className="category-strip">
                {categories.map((cat) => (
                    <div
                        className={`category-chip ${searchQuery === cat.label ? "active" : ""}`}
                        key={cat.label}
                        onClick={() => setSearchQuery(searchQuery === cat.label ? "" : cat.label)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="chip-emoji">{cat.emoji}</span>
                        <span className="chip-label">{cat.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Section Title ── */}
            <div className="section-header">
                <h2 className="section-title">Trending Now 🔥</h2>
                <button className="see-all-btn">
                    See all <ChevronRight size={16} />
                </button>
            </div>

            {/* ── Food Cards Grid ── */}
            <div className="food-grid">
                {foodCards.length > 0 ? (
                    foodCards.map((item) => (
                        <div className="food-card" key={item._id} onClick={() => navigate(`/food/${item._id}`)}>

                            {/* Image Section */}
                            <div className="food-card-img-wrapper">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="food-card-img"
                                    loading="lazy"
                                />
                                {/* Offer Badge - Using a default or item.offer if exists */}
                                {item.offer && <span className="offer-badge">{item.offer}</span>}
                                {/* Add to Cart Button */}
                                <button
                                    className="fav-btn"
                                    onClick={(e) => handleToggleCart(e, item._id)}
                                    style={{ 
                                        backgroundColor: userCart.includes(item._id) ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '50%'
                                    }}
                                >
                                    <ShoppingCart size={18} fill={userCart.includes(item._id) ? "white" : "none"} />
                                </button>


                                {item.promoted && <span className="promoted-tag">AD</span>}
                            </div>

                            {/* Info Section */}
                            <div className="food-card-info">
                                <div className="card-title-row">
                                    <h3 className="food-card-title">{item.title}</h3>
                                    <div className="rating-badge">
                                        <Star size={12} fill="#fff" stroke="#fff" />
                                        <span>{item.rating || '4.0'}</span>
                                    </div>
                                </div>
                                <p className="food-card-desc">{item.description}</p>
                                <div className="card-meta-row">
                                    <span className="food-card-price">₹{item.price}</span>
                                    <span className="meta-dot">•</span>
                                    <span className="delivery-time">
                                        <Clock size={13} />
                                        {item.deliveryTime || '30 mins'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No food items available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;