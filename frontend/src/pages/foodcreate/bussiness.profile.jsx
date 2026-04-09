import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Phone, Mail, Clock, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './bussiness-profile.css';

const BusinessProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Track actual files to upload
    const [imageFiles, setImageFiles] = useState({
        coverImage: null,
        logoImage: null
    });

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        operatingHours: "",
        address: "",
        description: "",
        isOpen: true,
        isVerified: false,
        coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=300&fit=crop",
        logoImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("https://food-reels-6se9.onrender.com/api/foodpartner/profile/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    withCredentials: true
                });

                const data = response.data.partner;
                setProfile(prev => ({
                    ...prev,
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    operatingHours: data.operatingHours || "",
                    address: data.address || "",
                    description: data.description || "",
                    isOpen: data.isOpen ?? true,
                    isVerified: data.isVerified || false,
                    // Keeping default images if DB is empty to make UI look good initially
                    coverImage: data.coverImage || prev.coverImage,
                    logoImage: data.logoImage || prev.logoImage
                }));
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setImageFiles(prev => ({ ...prev, [fieldName]: file }));

            // Generate immediate local preview
            const previewUrl = URL.createObjectURL(file);
            setProfile(prev => ({ ...prev, [fieldName]: previewUrl }));
        }
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const formData = new FormData();

            // Append standard fields
            formData.append("name", profile.name);
            formData.append("description", profile.description);
            formData.append("phone", profile.phone);
            formData.append("operatingHours", profile.operatingHours);
            formData.append("address", profile.address);
            formData.append("isOpen", profile.isOpen);

            // Append files if they were uniquely selected
            if (imageFiles.coverImage) {
                formData.append("coverImage", imageFiles.coverImage);
            }
            if (imageFiles.logoImage) {
                formData.append("logoImage", imageFiles.logoImage);
            }

            await axios.put("https://food-reels-6se9.onrender.com/api/foodpartner/profile", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/foodpartner/login");
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div className="bp-container">
            {/* --- HERO IMAGE & LOGO --- */}
            <div className="bp-header-banner">
                <img src={profile.coverImage} alt="Restaurant Cover" className="bp-cover-img" />
                <label className="bp-edit-cover-btn" style={{ cursor: 'pointer' }}>
                    <Camera size={16} /> Edit Cover
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'coverImage')} />
                </label>

                <div className="bp-logo-wrapper">
                    <img src={profile.logoImage} alt="Logo" className="bp-logo" />
                    <label className="bp-logo-edit-badge" style={{ cursor: 'pointer' }}>
                        <Camera size={14} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'logoImage')} />
                    </label>
                </div>
            </div>

            {/* --- TOP DETAILS --- */}
            <div className="bp-top-details">
                <div className="bp-title-row">
                    <h2>
                        {profile.name || "Set your business name"}
                        {profile.isVerified && <span><ShieldCheck size={18} className="verified-icon" /></span>}
                    </h2>

                    <label className="bp-toggle-switch">
                        <input
                            type="checkbox"
                            name="isOpen"
                            checked={profile.isOpen}
                            onChange={handleInputChange}
                        />
                        <span className="bp-slider"></span>
                        <span className="bp-toggle-label">{profile.isOpen ? 'Accepting Orders' : 'Currently Closed'}</span>
                    </label>
                </div>
                {/* Editable mini-description directly visible at the top */}
                <input
                    type="text"
                    name="description"
                    className="bp-desc"
                    style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
                    value={profile.description}
                    onChange={handleInputChange}
                    placeholder="Write a short sub-headline for your restaurant here..."
                />
            </div>

            {/* --- EDITABLE FORM SECTION --- */}
            <div className="bp-section">
                <h3 className="bp-section-title">Business Information</h3>

                <div className="bp-form-grid">
                    <div className="bp-input-group">
                        <label>Business Name</label>
                        <input type="text" name="name" value={profile.name} onChange={handleInputChange} placeholder="Enter business name" />
                    </div>

                    <div className="bp-input-group">
                        <label>Contact Email (Read Only)</label>
                        <div className="input-with-icon">
                            <Mail size={16} className="input-icon" />
                            <input type="email" name="email" value={profile.email} disabled style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }} />
                        </div>
                    </div>

                    <div className="bp-input-group">
                        <label>Phone Number</label>
                        <div className="input-with-icon">
                            <Phone size={16} className="input-icon" />
                            <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" />
                        </div>
                    </div>

                    <div className="bp-input-group">
                        <label>Operating Hours</label>
                        <div className="input-with-icon">
                            <Clock size={16} className="input-icon" />
                            <input type="text" name="operatingHours" value={profile.operatingHours} onChange={handleInputChange} placeholder="E.g. 10:00 AM - 11:00 PM" />
                        </div>
                    </div>

                    <div className="bp-input-group full-width">
                        <label>Full Address</label>
                        <div className="input-with-icon">
                            <MapPin size={16} className="input-icon" />
                            <input type="text" name="address" value={profile.address} onChange={handleInputChange} placeholder="Enter your full street address" />
                        </div>
                    </div>
                </div>

                <div className="bp-save-row">
                    <button className="bp-save-btn" onClick={handleSaveChanges} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* --- ACCOUNT ACTIONS --- */}
            <div className="bp-section">
                <h3 className="bp-section-title text-danger">Danger Zone</h3>
                <button className="bp-logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    Log Out of Partner Account
                </button>
            </div>

            <div style={{ height: '80px' }}></div>
        </div>
    );
};

export default BusinessProfile;
