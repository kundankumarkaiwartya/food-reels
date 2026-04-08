const orderModel = require("../models/order.model");

// Create a new order
async function createOrder(req, res) {
    try {
        const { foodCardId, quantity, totalPrice } = req.body;
        const userId = req.user.id; // User ID from auth middleware

        if (!foodCardId || !quantity || !totalPrice) {
            return res.status(400).json({ message: "Missing required order data." });
        }

        const newOrder = await orderModel.create({
            user: userId,
            foodCard: foodCardId,
            quantity,
            totalPrice
        });

        // Use populate to return detailed info (like title, image) to the frontend
        const detailedOrder = await orderModel.findById(newOrder._id).populate("foodCard");

        return res.status(201).json({
            message: "Order placed successfully!",
            order: detailedOrder
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// Fetch all orders for the current user
async function getUserOrders(req, res) {
    try {
        const userId = req.user.id;

        const orders = await orderModel.find({ user: userId })
            .populate("foodCard")
            .sort({ orderDate: -1 }); // Show newest orders first

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        console.error("Get Orders Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports = {
    createOrder,
    getUserOrders
};
