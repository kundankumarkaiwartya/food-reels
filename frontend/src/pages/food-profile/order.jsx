import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Clock, 
    ChevronRight, 
    ShoppingBag, 
    ArrowLeft,
    CheckCircle2,
    Package,
    Timer
} from 'lucide-react';
import './order.css';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/user/login');
                    return;
                }

                const response = await axios.get('https://food-reels-6se9.onrender.com/api/order/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(response.data.orders || []);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Orders Error:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('user');
                    navigate('/user/login');
                }
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return { color: '#267e3e', bg: '#e6f4ea', icon: <CheckCircle2 size={16} /> };
            case 'Cancelled': return { color: '#d93025', bg: '#fce8e6', icon: <ChevronRight size={16} /> };
            case 'Preparing': return { color: '#f97316', bg: '#fff4e6', icon: <Timer size={16} /> };
            default: return { color: '#1a73e8', bg: '#e8f0fe', icon: <Package size={16} /> };
        }
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="loader"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* ── Header ── */}
            <div className="orders-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h1>Order History</h1>
            </div>

            {/* ── Orders List ── */}
            <div className="orders-container">
                {error && <div className="error-msg">{error}</div>}

                {orders.length > 0 ? (
                    orders.map((order) => {
                        const style = getStatusStyle(order.status);
                        return (
                            <div className="order-card" key={order._id}>
                                <div className="order-card-header">
                                    <div className="res-info">
                                        <div className="res-img-wrapper">
                                            <img src={order.foodCard?.image} alt={order.foodCard?.title} />
                                        </div>
                                        <div className="res-details">
                                            <h3 className="res-name">{order.foodCard?.title}</h3>
                                            <p className="order-summary">
                                                {order.quantity} x Item{order.quantity > 1 ? 's' : ''} • ₹{order.totalPrice}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="order-status" style={{ background: style.bg, color: style.color }}>
                                        {style.icon}
                                        <span>{order.status}</span>
                                    </div>
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-time">
                                        <Clock size={14} />
                                        <span>Ordered on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}</span>
                                    </div>
                                    <button className="reorder-btn" onClick={() => navigate(`/food/${order.foodCard?._id}`)}>
                                        View Details
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-orders">
                        <div className="empty-icon-wrapper">
                            <ShoppingBag size={48} />
                        </div>
                        <h2>No orders yet</h2>
                        <p>Seems like you haven't ordered anything yet. Let's find something delicious!</p>
                        <button className="browse-btn" onClick={() => navigate('/feed')}>
                            Browse Food
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;
