import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Globe, Home as HomeIcon, Search, Compass, PlusSquare, User, MoreHorizontal } from 'lucide-react';
import '../styles/home.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ReelCard = ({ reel, togglelike, toggleCommentModal, activeCommentReel, comment, commentText, setCommentText, handlePostComment, inputRef }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.7,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoRef.current.play().catch(() => { });
                } else {
                    videoRef.current.pause();
                }
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="reel-wrapper">
            <div className="reel-content-container">
                <div className="reel-video-container" onClick={toggleMute}>
                    <video
                        ref={videoRef}
                        className="reel-video"
                        src={reel.video}
                        playsInline
                        loop
                        muted={isMuted}
                    />

                    <div className="reel-overlay">
                        <div className="reel-info">
                            <div className="creator-info">
                                <Link to={`/food-partner/${reel.foodpartnerId?._id || reel.foodpartnerId}`} className="creator-name" style={{ color: 'white', textDecoration: 'none' }}>
                                    @{reel.foodpartnerId?.businessName || "Food Lover"}
                                </Link>
                                <button className="follow-tag">Follow</button>
                            </div>
                            <p className="reel-description">
                                {reel.description}
                            </p>
                            <div className="visit-btn-container">
                                <Link to={`/food-partner/${reel.foodpartnerId?._id || reel.foodpartnerId}`} className="visit-button" style={{ marginTop: '10px' }}>
                                    <Globe size={16} /> Visit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Action Sidebar */}
                <div className="reel-side-actions">
                    <div className="action-btn-wrapper">
                        <button className="action-icon-btn" onClick={() => togglelike(reel._id)}>
                            <Heart size={28} fill={reel.isLiked ? "#ff4757" : "none"} color={reel.isLiked ? "#ff4757" : "white"} strokeWidth={2} />
                        </button>
                        <span className="action-count">{reel.likeCount || 0}</span>
                    </div>

                    <div className="action-btn-wrapper">
                        <button className="action-icon-btn" onClick={() => toggleCommentModal(reel._id)}>
                            <MessageCircle size={28} color="white" strokeWidth={2} />
                        </button>
                        <span className="action-count">{reel.commentCount || 0}</span>
                    </div>

                    <div className="action-btn-wrapper">
                        <button className="action-icon-btn">
                            <Bookmark size={28} color="white" strokeWidth={2} />
                        </button>
                        <span className="action-count">Save</span>
                    </div>

                    <div className="action-btn-wrapper">
                        <button className="action-icon-btn">
                            <MoreHorizontal size={28} color="white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comment Modal Popup */}
            {activeCommentReel === reel._id && (
                <div className="comment-overlay-backdrop" onClick={() => toggleCommentModal(null)}>
                    <div className="comment-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="comment-modal-header">
                            <h3>Comments</h3>
                            <button className="close-btn" onClick={() => toggleCommentModal(null)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                        </div>

                        <div className="comment-list-placeholder">
                            {comment && comment.length > 0 ? (
                                comment.map((c) => (
                                    <div className="comment-item" key={c._id}>
                                        <div className="comment-user">{c.user?.fullName || "Anonymous"}</div>
                                        <div className="comment-text">{c.comment}</div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
                                    Be the first to comment!
                                </p>
                            )}
                        </div>

                        <div className="comment-input-area">
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handlePostComment(reel._id)}
                                />
                                <button
                                    onClick={() => handlePostComment(reel._id)}
                                    disabled={!commentText.trim()}
                                    style={{ background: 'none', border: 'none', color: '#0095f6', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Home = () => {
    const [videos, setVideo] = useState([]);
    const [activeCommentReel, setActiveCommentReel] = useState(null);
    const [commentText, setCommentText] = useState("");
    const inputRef = useRef(null);
    const [comment, setcomment] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                setVideo(response.data.foodItems);
            })
            .catch(() => { })
    }, []);

    const toggleCommentModal = (reelId) => {
        if (activeCommentReel === reelId) {
            setActiveCommentReel(null);
        } else {
            setActiveCommentReel(reelId);
            setCommentText("");
        }

        if (reelId) {
            axios.get(`http://localhost:3000/api/food/comment/${reelId}`, {
                withCredentials: true
            })
                .then((response) => {
                    setcomment(response.data.comments);
                })
                .catch(() => { })
        }
    };

    const togglelike = async (reelId) => {
        try {
            await axios.post("http://localhost:3000/api/food/like", {
                foodId: reelId
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            });

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
            await axios.post("http://localhost:3000/api/food/comment", {
                foodId: reelId,
                comment: commentText
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                },
                withCredentials: true
            });

            axios.get(`http://localhost:3000/api/food/comment/${reelId}`)
                .then((response) => setcomment(response.data.comments));

        } catch (error) {
            console.error("error posting comment:", error);
        }
        setCommentText("");
    };

    return (
        <div className="reels-container">
            {/* Scrolling Feed */}
            <main className="reels-feed">
                {videos?.map((reel) => (
                    <ReelCard
                        key={reel._id}
                        reel={reel}
                        togglelike={togglelike}
                        toggleCommentModal={toggleCommentModal}
                        activeCommentReel={activeCommentReel}
                        comment={comment}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        handlePostComment={handlePostComment}
                        inputRef={inputRef}
                    />
                ))}
            </main>
        </div>
    );
};

export default Home;
