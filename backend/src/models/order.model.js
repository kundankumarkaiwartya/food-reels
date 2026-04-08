const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    foodCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodCard",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
