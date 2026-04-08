import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/foodcreate.css";
import axios from "axios";

const Foodcreate = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleUploadClick = () => {
        // Trigger click on hidden file input
        fileInputRef.current?.click();
    };
    const handleCreateReel = async () => {
        // 1. Validation check
        if (!videoFile) {
            alert("Please select a video to upload");
            return;
        }

        // 2. Prepare Form Data since we are uploading a file
        const formData = new FormData();
        formData.append("video", videoFile);   // Must match your multer upload.single("video") backend config
        formData.append("name", title);        // Title goes to "name" in DB
        formData.append("description", description);

        setIsLoading(true);

        try {
            // 3. Make the API request
            const response = await axios.post("http://localhost:3000/api/food", formData, {
                headers: {
                    "Content-Type": "multipart/form-data" // Required for files
                },
                withCredentials: true // Extremely important! Sends the auth cookie to authfoodpartnermiddleware
            });



            alert("Reel created successfully!");

            // Optional: clear the form or navigate() to the home page here

        } catch (error) {
            console.error("Upload error:", error);
            
            if (error.response && error.response.data && error.response.data.message === "INCOMPLETE_PROFILE") {
                alert("⚠️ Profile Incomplete: " + error.response.data.error + "\n\nPlease go to your Business Profile and fill in your details.");
            } else {
                alert("Failed to upload the reel");
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setVideoFile(file);
        }
    };

    return (
        <div className="foodcreate-page">
            <div className="foodcreate-container">
                <div className="foodcreate-header">
                    <h1>Create a Reel</h1>
                    <p>Share your delicious moments with the community</p>
                </div>

                {/* Upload Card */}
                <div className="upload-card" onClick={handleUploadClick}>
                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="upload-text">
                        {fileName ? fileName : "Click to select a video"}
                    </div>
                    {!fileName && <div className="upload-hint">MP4, WebM or OGG (Max. 50MB)</div>}
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden-file-input"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>

                {/* Form Inputs */}
                <div className="form-group">
                    <label>Reel Title</label>
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

                {/* Submit Action */}
                <button className="submit-btn"
                    type="button"
                    onClick={handleCreateReel}
                    disabled={isLoading}
                >
                    {isLoading ? "Uploading..." : "Create Reel"}
                    <svg className="submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
                <Link to="/foodcard">
                    <button className="navigate-btn">
                        <i>create card</i>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Foodcreate;