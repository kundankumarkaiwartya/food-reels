
import React, { useRef, useState } from "react";
import "../../styles/foodcreate.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Foodcardcreate = () => {
    const [imagefile, setImagefile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [deliverTime, setDeliverTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setImagefile(file);
        }
    };

    const handleCreateFoodCard = async () => {
        if (!imagefile) {
            alert("Please select an image to upload");
            return;
        }

        const formData = new FormData();
        formData.append("image", imagefile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("deliverTime", deliverTime);

        setIsLoading(true);

        try {
            const response = await axios.post("https://food-reels-6se9.onrender.com/api/food/createfoodcard", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });



            alert("Food card created successfully!");

            // Clear form
            setImagefile(null);
            setTitle("");
            setDescription("");
            setPrice("");
            setDeliverTime("");
            setFileName("");

        } catch (error) {
            console.error("Upload error:", error);

            if (error.response && error.response.data && error.response.data.message === "INCOMPLETE_PROFILE") {
                alert("⚠️ Profile Incomplete: " + error.response.data.error + "\n\nPlease go to your Business Profile and fill in your details.");
            } else {
                alert("Failed to create food card");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="foodcreate-page">
            <div className="foodcreate-container">
                <div className="foodcreate-header">
                    <h1>Create Food Card</h1>
                    <p>Share your delicious dishes with the community</p>
                </div>

                {/* Upload Card */}
                <div className="upload-card" onClick={handleUploadClick}>
                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="upload-text">
                        {fileName ? fileName : "Click to select an image"}
                    </div>
                    {!fileName && <div className="upload-hint">JPG, PNG or WebP (Max. 10MB)</div>}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>

                {/* Form Inputs */}
                <div className="form-group">
                    <label>Title</label>
                    <input type="text"
                        placeholder="e.g. The Best Burger in Town!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Tell your audience about this food..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number"
                        placeholder="e.g. 199"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Delivery Time</label>
                    <input type="text"
                        placeholder="e.g. 30-40 mins"
                        value={deliverTime}
                        onChange={(e) => setDeliverTime(e.target.value)}
                    />
                </div>

                {/* Submit Action */}
                <button className="submit-btn"
                    type="button"
                    onClick={handleCreateFoodCard}
                    disabled={isLoading}
                >
                    {isLoading ? "Uploading..." : "Create Food Card"}
                    <svg className="submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                <Link to="/create-food">
                    <button className="navigate-btn">
                        <i>create reel</i>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Foodcardcreate;
