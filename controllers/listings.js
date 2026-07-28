const Listing = require("../models/listing.js");
const {checkReviewed} = require("../utils/checkReviewed.js");
const { averageRating } = require("../utils/averageRating.js");
const { starRatingArray } = require("../utils/starRatingArray.js");
const {cloudinary} = require("../cloudConfig.js");

module.exports.index = async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", {listings, starRatingArray});
}

module.exports.renderCreateForm = (req, res) => {
    res.render("listings/add.ejs");
}

module.exports.createListing = async (req, res) => {
    const {title, description, price, location, country} = req.body;
    const {path, filename} = req.file;
    const newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    });
    newListing.image = {url: path, filename: filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings")
}

module.exports.showListing = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    // When a review is added browser redirects to show route and we update average reviews of that listing
    if(listing.reviews){
        console.log(listing.reviews);
        if(listing.reviews.length == 0){
            if(listing.avgRating && listing.avgRating != 0){
                listing.avgRating = 0;
                await listing.save();
            }
        } else{
            let avg = averageRating(listing.reviews).toFixed(1);
            if(!listing.avgRating){
                listing.avgRating = avg;
                await listing.save();
            }
            else if(listing.avgRating && listing.avgRating != avg){
                listing.avgRating = avg;
                await listing.save();
            }
        }
    }

    let userId;
    if(res.locals.currUser){
        userId = res.locals.currUser._id;
    }
    res.render("listings/show.ejs", {listing, checkReviewed, userId, averageRating, starRatingArray});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let imgUrl = listing.image.url;
    imgUrl = imgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, imgUrl});
}

module.exports.updateListing = async (req, res) => {
    const {id} = req.params;
    const {title, description, price, location, country} = req.body;
    if(typeof req.file !== "undefined"){
        const listing = await Listing.findById(id);
        const fname = listing.image.filename;
        await cloudinary.uploader.destroy(fname);
        let {path, filename} = req.file;
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            image: {url: path, filename: filename},
            price: price,
            location: location,
            country: country
        });
    } else{
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        });
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    const fname = listing.image.filename;
    await cloudinary.uploader.destroy(fname);
    const deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}
