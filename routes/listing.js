const express = require("express");

const router = express.Router();

const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/WrapAsync.js');
const {listingSchema} = require('../schema.js');

function validateSchema(req, res, next){
    let result = listingSchema.validate(req.body);
    let {error} = result;
    if(error){
        return next(new ExpressError(500, error));
    }
    next();
}

// index route
router.get("/", wrapAsync(async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", {listings});
}));

// add route
router.get("/new", (req, res) => {
    res.render("listings/add.ejs");
});


router.post("/", validateSchema, wrapAsync(async (req, res) => {
    const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    await newListing.save();
    res.redirect("/listings")
}));

// show route

router.get("/:id", wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

// update route

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

router.put("/:id", validateSchema, wrapAsync(async (req, res) => {
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
    res.redirect(`/listings/${id}`);
}));

// delete route

router.delete("/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;
