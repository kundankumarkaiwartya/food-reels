import React, { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Utensils, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './store.css';

const Store = () => {
    const [dashboard, setDashboard] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalItems: 0,
        menu: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/foodpartner/dashboard", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    withCredentials: true
                });

                setDashboard(response.data.dashboard);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const handleDelete = async (foodCardId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
        if (!confirmDelete) return;

        try {
            await axios.post(`http://localhost:3000/api/food/${foodCardId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            });

            // Optimistically remove the item from the local state
            setDashboard(prev => ({
                ...prev,
                totalItems: prev.totalItems - 1,
                menu: prev.menu.filter(item => item.id !== foodCardId)
            }));

            alert("Food item deleted successfully!");
        } catch (error) {
            console.error("Error deleting food item:", error);
            alert("Failed to delete food item. Please try again.");
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    return (
        <div className="store-container">
            {/* Header */}
            <div className="store-header">
                <div>
                    <h2>My Store Dashboard</h2>
                    <p>Welcome back! Here is how your store is performing today.</p>
                </div>
            </div>

            {/* --- TOP SECTION: SALES DASHBOARD --- */}
            <div className="dashboard-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon revenue-icon">
                        <IndianRupee size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Total Revenue</p>
                        <h3 className="stat-value">₹{dashboard.totalRevenue}</h3>
                        <p className="stat-trend positive"><TrendingUp size={14} /> +12% this week</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orders-icon">
                        <ShoppingBag size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Total Orders</p>
                        <h3 className="stat-value">{dashboard.totalOrders}</h3>
                        <p className="stat-trend positive"><TrendingUp size={14} /> +5% this week</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon items-icon">
                        <Utensils size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Menu Items</p>
                        <h3 className="stat-value">{dashboard.totalItems}</h3>
                        <p className="stat-trend neutral">Manage below</p>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION: MENU & INVENTORY MANAGEMENT --- */}
            <div className="inventory-section">
                <div className="inventory-header">
                    <h3>My Menu Items</h3>
                    <Link to="/create-food" className="add-item-btn" style={{ textDecoration: 'none' }}>
                        <Plus size={18} /> Add New Food
                    </Link>
                </div>

                <div className="menu-list">
                    {dashboard.menu && dashboard.menu.length > 0 ? (
                        dashboard.menu.map((item) => (
                            <div className="menu-list-item" key={item.id}>
                                <div className="menu-item-details">
                                    <h4>{item.title}</h4>
                                    <p className="menu-item-price">₹{item.price} • {item.orders} Orders</p>
                                </div>

                                <div className="menu-item-actions">
                                    <span className={`status-badge ${item.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                        {item.status}
                                    </span>
                                    <button className="icon-btn edit-btn"><Edit size={16} /></button>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>You haven't added any food cards yet.</p>
                    )}
                </div>
            </div>

            {/* Spacing for bottom navbar */}
            <div style={{ height: '80px' }}></div>
        </div>
    );
};

export default Store;
