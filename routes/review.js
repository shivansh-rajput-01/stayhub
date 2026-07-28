const express = require("express");

const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/WrapAsync.js');
const {reviewSchema} = require('../schema.js');
const { validateReviewSchema, isLoggedIn, isReviewAuthor, isEligible } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// review post route

router.post("/", isLoggedIn, isEligible, validateReviewSchema, wrapAsync(reviewController.createReview));

// review delete route

router.delete("/:review_id", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
