const mongoose = require("mongoose");


const foodCardSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    foodpartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true
    }

});

module.exports = mongoose.model("foodCard", foodCardSchema);