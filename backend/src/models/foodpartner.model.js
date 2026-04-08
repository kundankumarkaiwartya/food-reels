const mongoose = require("mongoose");

const foodpartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: ""
    },
    logoImage: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    operatingHours: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("foodpartner", foodpartnerSchema);