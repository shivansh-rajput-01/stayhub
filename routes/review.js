const express = require("express");

const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/WrapAsync.js');
const {reviewSchema} = require('../schema.js');

function validateReviewSchema(req, res, next){
    let result = reviewSchema.validate(req.body);
    if(result.error){
        return next(new ExpressError(500, result.error));
    }
    next();
}

// review post route

router.post("/", validateReviewSchema, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const {rating, comment} = req.body;

    let newReview = new Review({rating, comment});
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));

// review delete route

router.delete("/:review_id", wrapAsync(async (req, res) => {
    const {id, review_id} = req.params;

    await Review.findByIdAndDelete(review_id);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});

    res.redirect(`/listings/${id}`);
}));

module.exports = router;