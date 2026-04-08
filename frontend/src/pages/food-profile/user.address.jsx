import React, { useState } from 'react';
import { MapPin, Home, Briefcase, Navigation, Plus, Trash2, Edit2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './feed.css'; // Reusing feed styles for consistency

const UserAddress = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    // Real dynamic data (No backend logic)
    const [addresses, setAddresses] = useState([]);

    // Form States
    const [newLabel, setNewLabel] = useState('Home');
    const [newAddress, setNewAddress] = useState('');
    const [newDetails, setNewDetails] = useState('');

    const handleSave = () => {
        if (!newAddress.trim()) return; // Prevent empty addresses

        const iconComponent =
            newLabel === 'Home' ? <Home size={20} className="address-icon home-icon" color="var(--primary)" /> :
                newLabel === 'Work' ? <Briefcase size={20} className="address-icon work-icon" color="#4a90e2" /> :
                    <MapPin size={20} className="address-icon" color="#f5a623" />;

        const addressObj = {
            id: Date.now(),
            label: newLabel,
            icon: iconComponent,
            address: newAddress,
            details: newDetails,
            city: 'Saved Locally'
        };

        setAddresses([...addresses, addressObj]);
        setShowForm(false);
        setNewAddress('');
        setNewDetails('');
        setNewLabel('Home');
    };

    return (
        <div className="feed-page" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div className="section-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ChevronLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: '#fff' }} />
                <h2 className="section-title" style={{ margin: 0 }}>Saved Addresses 📍</h2>
            </div>

            {/* Address List */}
            {!showForm ? (
                <div style={{ padding: '0 20px' }}>
                    {/* Add New Button */}
                    <div
                        className="add-address-card"
                        onClick={() => setShowForm(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                            backgroundColor: 'var(--card-bg)', borderRadius: '15px',
                            border: '1px dashed var(--primary)', cursor: 'pointer', marginBottom: '20px'
                        }}
                    >
                        <div style={{ backgroundColor: 'rgba(255, 94, 98, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Plus size={24} />
                        </div>
                        <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '16px', fontWeight: '600' }}>Add New Address</h3>
                    </div>

                    {/* Render Real Addresses */}
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '10px' }}>Your Saved Addresses</h3>

                    <div className="address-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {addresses.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px 0' }}>
                                <p>No addresses saved yet. Add one above!</p>
                            </div>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr.id} className="address-card" style={{
                                    backgroundColor: 'var(--card-bg)', borderRadius: '15px',
                                    padding: '15px', display: 'flex', gap: '15px', border: '1px solid var(--border)'
                                }}>
                                    <div style={{ paddingTop: '5px' }}>
                                        {addr.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '16px' }}>{addr.label}</h4>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Trash2
                                                    size={16}
                                                    color="#ff4d4d"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
                                                />
                                            </div>
                                        </div>
                                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
                                            {addr.address}<br />{addr.details}
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>{addr.city}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                /* Add / Edit Form UI */
                <div style={{ padding: '0 20px' }}>
                    <div className="form-container" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '15px', padding: '20px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>Enter Address Details</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontSize: '14px', cursor: 'pointer' }}>
                                <Navigation size={16} /> Use Current Location
                            </div>
                        </div>

                        {/* Dummy Form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '5px' }}>Address Label</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewLabel(type)}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '10px',
                                                border: type === newLabel ? '1px solid var(--primary)' : '1px solid var(--border)',
                                                backgroundColor: type === newLabel ? 'rgba(255, 94, 98, 0.1)' : 'transparent',
                                                color: type === newLabel ? 'var(--primary)' : '#fff', cursor: 'pointer'
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '5px' }}>Complete Address</label>
                                <textarea
                                    rows="3"
                                    placeholder="House No, Building, Street Name..."
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', outline: 'none', resize: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '5px' }}>Floor / Landmark (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="E.g. Near Apollo Hospital"
                                    value={newDetails}
                                    onChange={(e) => setNewDetails(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    onClick={() => setShowForm(false)}
                                    style={{ flex: 1, padding: '15px', borderRadius: '10px', backgroundColor: 'transparent', border: '1px solid var(--border)', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{ flex: 1, padding: '15px', borderRadius: '10px', backgroundColor: 'var(--primary)', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Save Address
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAddress;
