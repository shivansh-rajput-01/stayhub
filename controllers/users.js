const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const { starRatingArray } = require("../utils/starRatingArray.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        let user1 = new User({username, email});
        const user = await User.register(user1, password);
        req.login(user, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Stayhub")
            res.redirect("/listings");
        });
    }
    catch (err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Stayhub");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
}

module.exports.profile = async(req, res) => {
  let {user} = req;
  const listings = await Listing.find({owner: user._id}).populate("reviews");
  let avgReview, avgNumber, maxReview;
  let numReviews = 0;
  let reviewSum = 0;
  maxReview = 0;
  for(let listing of listings){
    if(listing.reviews){
        numReviews += listing.reviews.length;
        if(listing.reviews.length > maxReview){
            maxReview = listing.reviews.length;
        }
        for(let review of listing.reviews){
            reviewSum += review.rating;
        }
    }
  }
  avgNumber = numReviews / listings.length;
  avgReview = reviewSum / numReviews;
  res.render("users/profile.ejs", {user, listings, starRatingArray, avgNumber, avgReview, maxReview});
}
