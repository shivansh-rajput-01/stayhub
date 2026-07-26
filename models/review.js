const mongoose = require("mongoose");

const {Schema} = mongoose;

const User = require("./user.js");

const reviewSchema = new Schema({
    rating: Number,
    comment: String,
    created_At: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
