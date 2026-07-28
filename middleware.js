const Listing = require("./models/listing");
const Review = require("./models/review.js")
const {listingSchema, reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login needed!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = function(req, res, next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async function(req, res, next){
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateSchema = function(req, res, next){
    let result = listingSchema.validate(req.body);
    let {error} = result;
    if(error){
        return next(new ExpressError(500, error));
    }
    next();
}

module.exports.validateReviewSchema = function(req, res, next){
    let result = reviewSchema.validate(req.body);
    if(result.error){
        return next(new ExpressError(500, result.error));
    }
    next();
}

module.exports.isReviewAuthor = async function(req, res, next){
    console.log(req.params);
    let {review_id} = req.params;
    const review = await Review.findById(review_id);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Your are not author of this review");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};

module.exports.isEligible = async function(req, res, next){
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    let review = listing.reviews;
    for(let r of review){
        if(r.author.equals(req.user._id)){
            req.flash("error", "you already have a review on this listing");
            return res.redirect(`/listings/${id}`);
        }
    }
    next();
}
