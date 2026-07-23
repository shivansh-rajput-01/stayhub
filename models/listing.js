const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/palm-tree-near-seashore-Siuwr3uCir0",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
        }
    ],
    price: Number,
    location: String,
    country: String
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;