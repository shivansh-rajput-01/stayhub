const mongoose = require("mongoose");

const {Schema} = mongoose;

const reviewSchema = new Schema({
    rating: Number,
    comment: String,
    created_At: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
