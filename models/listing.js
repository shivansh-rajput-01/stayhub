const mongoose = require("mongoose");

const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/palm-tree-near-seashore-Siuwr3uCir0",
        set: (v) => v === "" ? "https://unsplash.com/photos/palm-tree-near-seashore-Siuwr3uCir0": v
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;