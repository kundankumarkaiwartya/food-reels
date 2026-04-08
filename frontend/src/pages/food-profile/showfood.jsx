import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Star,
    Clock,
    ShoppingCart,
    Zap,
    Heart,
    Share2,
    Plus,
    Minus,
    Info,
    Shield
} from 'lucide-react';
import './showfood.css';

const Showfood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                // Since there is no single item API, we fetch all and filter for now
                // Alternatively, you can create a new route in backend later
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/food/getfoodcard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const foundFood = response.data.foodCard.find(item => item._id === id);
                if (foundFood) {
                    setFood(foundFood);
                } else {
                    // Fallback to dummy data for demonstration if not found
                    setFood({
                        _id: id,
                        title: 'Premium Pepperoni Pizza',
                        description: 'Indulge in our signature Pepperoni Pizza, featuring a perfectly hand-tossed thin crust, topped with premium buffalo mozzarella, spicy pepperoni slices, and our secret roasted tomato sauce. Garnished with fresh basil and a drizzle of chilli oil.',
                        price: 499,
                        deliveryTime: '25-30 min',
                        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
                        rating: 4.8,
                        reviews: 124,
                        isVeg: false,
                        offer: '50% OFF | Use WELCOME50'
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching food details:", error);
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/user/login');
                return;
            }
            await axios.post('http://localhost:3000/api/food/cart', {
                foodCardId: food._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Added to Cart successfully! 🛒");
        } catch (error) {
            console.error("Cart Error:", error);
            alert("Failed to add to cart");
        }
    };

    const handleOrder = async () => {
        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/user/login');
                return;
            }

            const response = await axios.post('http://localhost:3000/api/order', {
                foodCardId: food._id,
                quantity: quantity,
                totalPrice: food.price * quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 201) {
                navigate('/activeorders');
            }
        } catch (error) {
            console.error("Order Error:", error);
            alert(error.response?.data?.message || "Something went wrong while placing order.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {

        return (
            <div className="showfood-loading">
                <div className="loader"></div>
                <p>Preparing your delicious experience...</p>
            </div>
        );
    }

    if (!food) {
        return (
            <div className="showfood-error">
                <p>Food item not found.</p>
                <button onClick={() => navigate('/feed')}>Back to Feed</button>
            </div>
        );
    }

    return (
        <div className="showfood-container">
            {/* ── Top Header Navigation ── */}
            <div className="showfood-header-btns">
                <button className="header-round-btn back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-right-btns">
                    <button className="header-round-btn" onClick={() => setIsFavorite(!isFavorite)}>
                        <Heart size={20} className={isFavorite ? 'heart-filled' : ''} />
                    </button>
                    <button className="header-round-btn">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* ── Hero Image Section ── */}
            <div className="showfood-hero">
                <img src={food.image} alt={food.title} className="hero-img" />
                <div className="hero-overlay-bottom" />
            </div>

            {/* ── Content Section ── */}
            <div className="showfood-content">
                <div className="content-card">
                    {/* Tags & Badges */}
                    <div className="badges-row">
                        <span className={`veg-tag ${food.isVeg ? 'veg' : 'non-veg'}`}>
                            <div className="tag-circle" />
                        </span>
                        {food.offer && <span className="offer-tag">{food.offer}</span>}
                    </div>

                    {/* Title & Rating */}
                    <div className="title-row">
                        <div className="title-left">
                            <h1 className="food-title">{food.title}</h1>
                            <div
                                className="restaurant-name"
                                style={{ cursor: 'pointer', opacity: 0.8, transition: '0.2s', ':hover': { opacity: 1, textDecoration: 'underline' } }}
                                onClick={() => food.foodpartnerId?._id && navigate(`/food-partner/${food.foodpartnerId._id}`)}
                            >
                                {food.foodpartnerId?.name || 'Specialty Kitchen'}
                            </div>
                        </div>
                        <div className="rating-pill">
                            <Star size={14} fill="#fff" stroke="#fff" />
                            <span>{food.rating || '4.0'}</span>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="meta-info-strip">
                        <div className="meta-item">
                            <Clock size={16} />
                            <span>{food.deliveryTime || '30 mins'}</span>
                        </div>
                        <div className="meta-item">
                            <Star size={16} className="star-icon" />
                            <span>{food.reviews || '50+'} Reviews</span>
                        </div>
                        <div className="meta-item">
                            <Shield size={16} />
                            <span>Health Checked</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="section-divider" />

                    {/* Description */}
                    <div className="description-section">
                        <h3>Description</h3>
                        <p>{food.description}</p>
                    </div>

                    {/* Quantity Selector Style */}
                    <div className="quantity-section">
                        <h3>Select Quantity</h3>
                        <div className="qty-picker">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Minus size={18} />
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Extra Info */}
                    <div className="extra-info-card">
                        <Info size={16} />
                        <p>Prices are inclusive of all taxes. Free delivery on orders above ₹1000.</p>
                    </div>
                </div>
            </div>

            {/* ── Sticky Footer ── */}
            <div className="showfood-footer">
                <div className="price-summary">
                    <span className="total-label">Subtotal</span>
                    <span className="total-amount">₹{food.price * quantity}</span>
                </div>
                <div className="action-btns">
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                    </button>
                    <button className="order-now-btn" onClick={handleOrder} disabled={submitting}>
                        <Zap size={18} fill="#fff" />
                        <span>{submitting ? 'Placing Order...' : 'Order Now'}</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Showfood;