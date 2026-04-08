const foodpartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");
const foodCardModel = require("../models/foodCard");
const orderModel = require("../models/order.model");
const { v4: uuid } = require("uuid");
const storageService = require("../services/storage.service");

async function getfoodpartnerById(req, res) {
    const foodpartnerId = req.params.id;

    const foodpartner = await foodpartnerModel.findById(foodpartnerId);

    if (!foodpartner) {
        return res.status(404).json({ message: "food partner not found" })
    }

    const reels = await foodModel.find({ foodpartnerId });

    res.status(200).json({
        message: "food partner fetched successfully",
        foodpartner: {
            ...foodpartner.toObject(),
            reels
        }
    })
}

async function getStoreDashboard(req, res) {
    try {
        const partnerId = req.foodpartner._id;

        // 1. Fetch all food cards owned by this food partner
        const myFoodCards = await foodCardModel.find({ foodpartnerId: partnerId });

        // Extract array of foodCard IDs
        const foodCardIds = myFoodCards.map(card => card._id);

        // 2. Fetch all orders containing these food cards
        const storeOrders = await orderModel.find({ foodCard: { $in: foodCardIds } });

        // 3. Calculate total revenue & total orders
        let totalRevenue = 0;
        let totalOrders = 0;

        storeOrders.forEach(order => {
            const qty = order.quantity || 1;
            totalOrders += qty;
            totalRevenue += (order.totalPrice || 0);
        });

        // 4. Transform menu items to include their individual order stats
        const myMenu = myFoodCards.map(card => {
            // Find orders specifically for this card
            const myCardOrders = storeOrders.filter(o => o.foodCard.toString() === card._id.toString());
            const thisCardTotalOrders = myCardOrders.reduce((sum, order) => sum + (order.quantity || 1), 0);

            return {
                id: card._id,
                title: card.title,
                price: card.price,
                orders: thisCardTotalOrders,
                status: 'Active' // Hardcoded logic for now, add logic if item has status field later
            };
        });

        res.status(200).json({
            message: "Dashboard fetched successfully",
            dashboard: {
                totalRevenue,
                totalOrders,
                totalItems: myMenu.length,
                menu: myMenu
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Internal server error while fetching dashboard" });
    }
}

async function getBusinessProfile(req, res) {
    try {
        const partner = req.foodpartner;
        res.status(200).json({
            message: "Profile fetched successfully",
            partner: {
                id: partner._id,
                name: partner.name,
                email: partner.email,
                coverImage: partner.coverImage,
                logoImage: partner.logoImage,
                description: partner.description,
                phone: partner.phone,
                operatingHours: partner.operatingHours,
                address: partner.address,
                isOpen: partner.isOpen,
                isVerified: partner.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

async function updateBusinessProfile(req, res) {
    try {
        const partnerId = req.foodpartner._id;
        const {
            name,
            description,
            phone,
            operatingHours,
            address,
            isOpen
        } = req.body;

        const updateData = {
            name,
            description,
            phone,
            operatingHours,
            address,
            isOpen
        };

        // Handle File Uploads for Cover Image
        if (req.files && req.files.coverImage) {
            const coverUpload = await storageService.uploadFile(req.files.coverImage[0].buffer, uuid());
            if (coverUpload && coverUpload.url) {
                updateData.coverImage = coverUpload.url;
            }
        }

        // Handle File Uploads for Logo Image
        if (req.files && req.files.logoImage) {
            const logoUpload = await storageService.uploadFile(req.files.logoImage[0].buffer, uuid());
            if (logoUpload && logoUpload.url) {
                updateData.logoImage = logoUpload.url;
            }
        }

        const updatedPartner = await foodpartnerModel.findByIdAndUpdate(
            partnerId,
            updateData,
            { new: true } // Returns the updated document
        );

        res.status(200).json({
            message: "Profile updated successfully",
            partner: updatedPartner
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal server error while updating profile" });
    }
}

module.exports = {
    getfoodpartnerById,
    getStoreDashboard,
    getBusinessProfile,
    updateBusinessProfile
}