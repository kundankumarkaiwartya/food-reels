// src/controller/food.controller.js

const foodModel = require("../models/food.model");
const { v4: uuid } = require("uuid");
const storageService = require("../services/storage.service");
const likesModel = require("../models/likes.model");
const commentModel = require("../models/comment.model");
const foodCardModel = require("../models/foodCard.js");
const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");


async function createFood(req, res) {
    try {
        // Check if file exists before accessing .buffer
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded. Please use the key 'video'." });
        }

        // Attempt upload to ImageKit
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

        if (!fileUploadResult || !fileUploadResult.url) {
            return res.status(500).json({ message: "ImageKit upload failed" });
        }

        // Create database entry
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodpartnerId: req.foodpartner.id
        });

        res.status(201).json({
            message: "food created successfully",
            food: foodItem
        });

    } catch (error) {
        console.error("Create Food Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

async function getfooditem(req, res) {
    try {
        // Optional user check from token
        let user = null;
        let token = req.cookies.token;
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token && token !== "null" && token !== "undefined") {
            try {
                const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
                const userModel = require("../models/user.model");
                user = await userModel.findById(decoded.id);
            } catch (err) {
                // Ignore invalid token, just treat as not logged in
            }
        }

        const foodItems = await foodModel.find({}).populate("foodpartnerId").lean();

        const foodItemsWithCounts = await Promise.all(foodItems.map(async (item) => {
            const likeCount = await likesModel.countDocuments({ food: item._id });
            const commentCount = await commentModel.countDocuments({ food: item._id });

            let isLiked = false;
            if (user) {
                const existingLike = await likesModel.findOne({
                    user: user._id,
                    food: item._id
                });
                isLiked = !!existingLike;
            }

            return {
                ...item,
                likeCount,
                commentCount,
                isLiked
            };
        }));

        res.status(200).json({
            message: "fetched food items successfully",
            foodItems: foodItemsWithCounts
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAllreadyLiked = await likesModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAllreadyLiked) {
        await likesModel.deleteOne({
            user: user._id,
            food: foodId
        })
        return res.status(200).json({
            message: "unliked successfully",

        })
    }
    const like = await likesModel.create({
        user: user._id,
        food: foodId
    })
    return res.status(200).json({
        message: "liked successfully",
        like
    })
}

async function getlike(req, res) {
    const { foodId } = req.params;
    const like = await likesModel.find({
        food: foodId
    })
    return res.status(200).json({
        message: "fetched likes successfully",
        like
    })
}
async function commentFood(req, res) {
    try {
        const { foodId, comment } = req.body;
        const user = req.user;

        // 1. (Optional but recommended) Validate that the data actually exists
        if (!foodId || !comment) {
            return res.status(400).json({ message: "foodId and comment are required" });
        }

        if (!user) {
            return res.status(401).json({ message: "User not found or unauthorized" });
        }

        // 2. Save to database
        const commentonfood = await commentModel.create({
            user: user._id,
            food: foodId,
            comment
        });

        // 3. Return success
        return res.status(200).json({
            message: "commented successfully",
            comment: commentonfood
        });

    } catch (error) {
        // This catches any database errors and prevents a server crash
        console.error("Comment Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function getComments(req, res) {
    try {
        const { foodId } = req.params;

        if (!foodId || foodId === "null" || foodId === "undefined") {
            return res.status(400).json({ message: "Invalid food ID" });
        }

        const comments = await commentModel.find({
            food: foodId
        }).populate("user", "fullName");
        res.status(200).json({
            message: "fetched comments successfully",
            comments
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function createfoodCard(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "no image file uploaded.please use the key 'image'"
            });
        }
        const { title, description, price, deliverTime } = req.body;
        const foodpartnerId = req.foodpartner.id;

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

        if (!fileUploadResult || !fileUploadResult.url) {
            return res.status(500).json({ message: "ImageKit upload failed" });
        }

        const foodCard = await foodCardModel.create({
            title,
            description,
            price,
            deliveryTime: deliverTime,
            image: fileUploadResult.url,
            foodpartnerId: req.foodpartner.id
        })

        return res.status(201).json({
            message: "food card created successfully",
            foodCard
        })
    } catch (error) {
        console.error("Create Food Card Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

async function getfoodCard(req, res) {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            };
        }

        const foodCard = await foodCardModel.find(query).populate("foodpartnerId");
        return res.status(200).json({
            message: "fetched food cards successfully",
            foodCard
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

async function toggleCartItem(req, res) {
    try {
        const userId = req.user._id;
        const { foodCardId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const currentCart = user.cart || [];
        const isInCart = currentCart.some(id => id.toString() === foodCardId.toString());

        let updatedUser;
        if (isInCart) {
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $pull: { cart: foodCardId } },
                { new: true }
            );
        } else {
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $push: { cart: foodCardId } },
                { new: true }
            );
        }

        return res.status(200).json({
            message: isInCart ? "Removed from cart" : "Added to cart",
            cart: updatedUser.cart
        });
    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getCartItems(req, res) {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'foodpartnerId',
                select: 'name isVerified'
            }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart: user.cart
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function deletefoodcard(req, res) {
    try {
        const { foodCardId } = req.params;

        // 1. Find the food card first (WITHOUT deleting immediately)
        const foodCard = await foodCardModel.findById(foodCardId);

        if (!foodCard) {
            return res.status(404).json({
                message: "food card not found"
            });
        }

        // 2. Validate Authorization
        if (foodCard.foodpartnerId.toString() !== req.foodpartner.id) {
            return res.status(403).json({
                message: "you are not authorized to delete this food card"
            });
        }

        // 3. Delete from DB using correct Mongoose method
        await foodCardModel.findByIdAndDelete(foodCardId);

        return res.status(200).json({
            message: "food card deleted successfully",
            foodCard
        });
    } catch (error) {
        console.error("Delete Food Card Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Count total orders for the user to show in stats
        const orderCount = await orderModel.countDocuments({ user: userId });

        return res.status(200).json({
            message: "Profile fetched successfully",
            user,
            orderCount
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}



module.exports = {
    createFood,
    getfooditem,
    likeFood,
    commentFood,
    getComments,
    getlike,
    createfoodCard,
    getfoodCard,
    deletefoodcard,
    getUserProfile,
    toggleCartItem,
    getCartItems
}


module.exports = {
    createFood,
    getfooditem,
    likeFood,
    commentFood,
    getComments,
    getlike,
    createfoodCard,
    getfoodCard,
    deletefoodcard,
    getUserProfile,
    toggleCartItem,
    getCartItems
}

