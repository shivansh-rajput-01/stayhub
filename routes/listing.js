const express = require("express");

const router = express.Router();

const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/WrapAsync.js');
const {listingSchema} = require('../schema.js');
const {isLoggedIn, isOwner, validateSchema} = require("../middleware.js");
const {checkReviewed} = require("../utils/checkReviewed.js");

// index route
router.get("/", wrapAsync(async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", {listings});
}));

// add route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/add.ejs");
});


router.post("/", isLoggedIn, validateSchema, wrapAsync(async (req, res) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings")
}));

// show route

router.get("/:id", wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let userId;
    if(res.locals.currUser){
        userId = res.locals.currUser._id;
    }
    res.render("listings/show.ejs", {listing, checkReviewed, userId});
}));

// update route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

router.put("/:id", isLoggedIn, isOwner, validateSchema, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// delete route

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}));


module.exports = router;
