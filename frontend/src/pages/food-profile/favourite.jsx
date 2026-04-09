import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, Clock, ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './feed.css'; // Reusing feed styles for consistency

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get("https://food-reels-6se9.onrender.com/api/food/cart", {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                setCart(response.data.cart || []);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleRemoveFromCart = async (e, foodCardId) => {
        e.stopPropagation();
        // Optimistic UI Update
        setCart(prev => prev.filter(item => item._id !== foodCardId));
        try {
            await axios.post("https://food-reels-6se9.onrender.com/api/food/cart", { foodCardId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                withCredentials: true
            });
        } catch (err) {
            console.error("Failed to remove from cart");
        }
    };

    if (loading) return <div className="feed-loading"><div className="loader"></div></div>;

    return (
        <div className="feed-page">
            <div className="section-header" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
                <ChevronLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                <h2 className="section-title">Your Cart 🛒</h2>
            </div>

            <div className="food-grid" style={{ padding: '0 20px' }}>
                {cart.length > 0 ? (cart.map((item) => (
                    <div className="food-card" key={item._id} onClick={() => navigate(`/food/${item._id}`)}>
                        <div className="food-card-img-wrapper">
                            <img src={item.image} alt={item.title} className="food-card-img" />
                            {/* Remove from Cart Button */}
                            <button 
                                className="fav-btn" 
                                onClick={(e) => handleRemoveFromCart(e, item._id)}
                                style={{ backgroundColor: 'rgba(255, 77, 77, 0.9)', color: 'white', border: 'none', padding: '8px', borderRadius: '50%' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="food-card-info">
                            <div className="card-title-row">
                                <h3 className="food-card-title">{item.title}</h3>
                                <div className="rating-badge"><Star size={12} fill="#fff" /><span>4.0</span></div>
                            </div>
                            <p className="food-card-desc">{item.description}</p>
                            <div className="card-meta-row">
                                <span className="food-card-price">₹{item.price}</span>
                                <span className="meta-dot">•</span>
                                <span className="delivery-time"><Clock size={13} /> {item.deliveryTime || '30 mins'}</span>
                            </div>
                        </div>
                    </div>
                ))) : (
                    <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                        <ShoppingCart size={40} style={{ color: 'var(--text-secondary)', marginBottom: '15px' }} />
                        <p>Your cart is empty! Head to the feed to start ordering.</p>
                        <button 
                            onClick={() => navigate('/feed')} 
                            style={{ padding: '12px 24px', marginTop: '20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Explore Food
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
