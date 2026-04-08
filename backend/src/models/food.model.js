const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    foodpartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    }
})

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;