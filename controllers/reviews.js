const Listing = require("../models/listing.js");

const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
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
}

module.exports.destroyReview = async (req, res) => {
    const {id, review_id} = req.params;

    await Review.findByIdAndDelete(review_id);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}
