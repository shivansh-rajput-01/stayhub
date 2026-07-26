const express = require("express");

const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/WrapAsync.js');
const {reviewSchema} = require('../schema.js');
const { validateReviewSchema, isLoggedIn, isReviewAuthor, isEligible } = require("../middleware.js");

// review post route

router.post("/", isLoggedIn, isEligible, validateReviewSchema, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const {rating, comment} = req.body;

    let newReview = new Review({rating, comment});
    newReview.author = req.user._id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review added!");

    res.redirect(`/listings/${id}`);
}));

// review delete route

router.delete("/:review_id", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const {id, review_id} = req.params;

    await Review.findByIdAndDelete(review_id);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
