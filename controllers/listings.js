const Listing = require("../models/listing.js");
const {checkReviewed} = require("../utils/checkReviewed.js");
const { averageRating } = require("../utils/averageRating.js");
const { starRatingArray } = require("../utils/starRatingArray.js");
const {cloudinary} = require("../cloudConfig.js");
const axios = require('axios');
const { pushUnique } = require("../utils/pushUnique.js");

async function geoCode(location, country){
    let uri = encodeURIComponent(`${location},${country}`);
    uri = `https://nominatim.openstreetmap.org/search?format=json&q=${uri}`;

    let response = await axios.get(uri, {
        headers: {
            'User-Agent': 'StayHub (support@stayhub.com)'
        }
    });
        
    let data = response.data;

    if (!data || data.length === 0) {
        return null;
    }

    let lat = data[0].lat;
    let lon = data[0].lon;

    return geometry = {
        type: "Point",
        coordinates: [lon, lat] 
    };
}

module.exports.index = async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", {listings, starRatingArray});
}

module.exports.renderCreateForm = (req, res) => {
    res.render("listings/add.ejs");
}

module.exports.createListing = async (req, res) => {
    const {title, description, price, location, country, infilter} = req.body;
    const {path, filename} = req.file;
    const newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        category: infilter
    });
    const geometry = await geoCode(location, country);
    if(!geometry){
        req.flash("error", "Location not available");
        return res.redirect("/listings/new");
    }
    newListing.geometry = geometry;
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
    const {title, description, price, location, country, infilter} = req.body;
    let geometry;
    const listing = await Listing.findById(id);
    const fname = listing.image.filename;
    if(listing.location != location || listing.country != country){
        geometry = await geoCode(location, country);
        if(!geometry){
            req.flash("error", "Location not available");
            return res.redirect(`/listings/${id}/edit`);
        }
        listing.geometry = geometry;
        await listing.save();
    }
    if(typeof req.file !== "undefined"){
        await cloudinary.uploader.destroy(fname);
        let {path, filename} = req.file;
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            image: {url: path, filename: filename},
            price: price,
            location: location,
            country: country,
            category: infilter
        });
    } else{
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country,
            category: infilter
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

module.exports.filterListing = async (req, res) => {
    let {infilter} = req.query;
    if(!infilter){
        req.flash("error", "No filter applied");
        return res.redirect("/listings");
    }
    let validInput = [
        "trending",
        "rooms",
        "iconic-cities",
        "mountains",
        "amazing-pools",
        "camping",
        "farms",
        "arctic",
        "other"
    ];
    let filteredListings = await Listing.find({category: infilter});
    res.render("listings/filter.ejs", {filteredListings, starRatingArray, infilter, validInput});
}

module.exports.searchListing = async (req, res) => {
  let {searchedlisting} = req.query;
  if(!searchedlisting.trim()){
    req.flash("error", "Nothing Searched");
    return res.redirect("/listings");
  }
  let searchWord = searchedlisting.trim().split(/\s+/);
  let searchWords = [];
  let title = [];
  let location = [];
  let country = [];
  let category = [];
  let remove = ["in", "the", "a", "of", "at", "under", "after"];
  for(let word of searchWord){
    if(!remove.includes(word)){
        searchWords.push(word);
    }
  }
  for(let word of searchWords){
    let t = await Listing.find({title: {$regex : word, $options: "i"}});
    let l = await Listing.find({location: {$regex : word, $options: "i"}});
    let c = await Listing.find({country: {$regex : word, $options: "i"}});
    let categ = await Listing.find({category: {$regex : word, $options: "i"}});
    if(t.length){
        title = pushUnique(t, title);
    }
    if(l.length){
        location = pushUnique(l, location)
    }
    if(c.length){
        country = pushUnique(c, country);
    }
    if(categ.length){
        category = pushUnique(categ, category);
    }
  }
  res.render("listings/search.ejs", {title, location, country, category, starRatingArray, searchedlisting});
}
