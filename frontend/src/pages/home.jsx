import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Globe } from 'lucide-react';
import '../styles/home.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [videos, setVideo] = useState([]);
    const [activeCommentReel, setActiveCommentReel] = useState(null);
    const [commentText, setCommentText] = useState("");
    const inputRef = useRef(null);
    const [comment, setcomment] = useState([]);
    const [like, setLike] = useState(0);

    // Focus the input safely without triggering browser scroll jumps
    useEffect(() => {
        if (activeCommentReel && inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    }, [activeCommentReel]);

    useEffect(() => {
        axios.get("https://food-reels-6se9.onrender.com/api/food", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                setVideo(response.data.foodItems);
            })
            .catch(() => {})
    }, []);

    const toggleCommentModal = (reelId) => {
        if (activeCommentReel === reelId) {
            setActiveCommentReel(null);
        } else {
            setActiveCommentReel(reelId);
            setCommentText(""); // Clear the input when opening
        }

        // Only fetch comments if we are opening a reel (reelId is not null)
        if (reelId) {
            axios.get(`https://food-reels-6se9.onrender.com/api/food/comment/${reelId}`, {
                withCredentials: true
            })
                .then((response) => {
                    setcomment(response.data.comments);
                })
                .catch(() => {})
        }
    };

    const togglelike = async (reelId) => {
        try {
            const response = await axios.post("https://food-reels-6se9.onrender.com/api/food/like", {
                foodId: reelId
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            });

            // Optimistically update the UI!
            setVideo(prevVideos => prevVideos.map(reel => {
                if (reel._id === reelId) {
                    const currentlyLiked = reel.isLiked;
                    return {
                        ...reel,
                        isLiked: !currentlyLiked,
                        likeCount: currentlyLiked ? reel.likeCount - 1 : reel.likeCount + 1
                    };
                }
                return reel;
            }));


        } catch (error) {
            console.error("error toggling like:", error);
        }
    };

    const handlePostComment = async (reelId) => {
        if (!commentText.trim()) return;



        try {
            await axios.post("https://food-reels-6se9.onrender.com/api/food/comment", {
                foodId: reelId,
                comment: commentText
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            });

            // Fetch updated comments
            axios.get(`https://food-reels-6se9.onrender.com/api/food/comment/${reelId}`)
                .then((response) => setcomment(response.data.comments));

        } catch (error) {
            console.error("error posting comment:", error);
        }

        // Don't forget to clear the comment box after posting!
        setCommentText("");
    };

    return (
        <div className="reels-container">
            {/* Map over the fetched videos array */}
            {videos?.map((reel) => (
                <div key={reel._id} className="reel-wrapper">
                    <video
                        className="reel-video"
                        // If it's a full URL in the database, use reel.video
                        // If it's a relative path (e.g. /uploads/video.mp4), append localhost:3000
                        src={reel.video}
                        playsInline
                        autoPlay
                        muted
                        loop
                    />

                    {/* Left Action Sidebar */}
                    <div className="reel-sidebar-left">
                        <button className="action-button" onClick={() => togglelike(reel._id)}>
                            <span className="icon" style={{ color: reel.isLiked ? 'red' : 'inherit' }}>
                                <Heart size={24} fill={reel.isLiked ? "red" : "none"} strokeWidth={reel.isLiked ? 1 : 2} />
                            </span>
                            <span className="action-text">{reel.likeCount || 0} Like</span>
                        </button>
                        <button className="action-button" onClick={() => toggleCommentModal(reel._id)}>
                            <span className="icon"><MessageCircle size={24} /></span>
                            <span className="action-text">{reel.commentCount || 0}Comment</span>
                        </button>
                        <button className="action-button">
                            <span className="icon"><Bookmark size={24} /></span>
                            <span className="action-text">Save</span>
                        </button>
                    </div>

                    <div className="reel-overlay">
                        <div className="reel-actions">
                            <Link to={`/food-partner/${reel.foodpartnerId?._id || reel.foodpartnerId}`} className="visit-button" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Globe size={18} /> Visit Profile
                            </Link>
                            <p className="reel-description">
                                {reel.description}
                            </p>
                        </div>
                    </div>

                    {/* Comment Modal Popup (z-index) */}
                    {activeCommentReel === reel._id && (
                        <div className="comment-overlay-backdrop" onClick={() => toggleCommentModal(null)}>
                            <div className="comment-modal-card" onClick={(e) => e.stopPropagation()}>
                                <div className="comment-modal-header">
                                    <h3>Comments</h3>
                                    <button className="close-btn" onClick={() => toggleCommentModal(null)}>✕</button>
                                </div>

                                <div className="comment-list-placeholder">
                                    {comment && comment.length > 0 ? (

                                        comment.map((c) => {

                                            return (
                                                <div key={c._id}>
                                                    <p style={{ fontWeight: "bold" }}>{c.user?.fullName || "Anonymous"}</p>
                                                    <p>{c.comment}</p>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
                                            Be the first to comment!
                                        </p>
                                    )}

                                </div>

                                <div className="comment-input-area">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handlePostComment(reel._id)}
                                        disabled={!commentText.trim()}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Home;