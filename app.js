require('dotenv').config();

const express = require("express");
const Listing = require("./models/listing.js");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const dbUrl = process.env.MONGO_URL;
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => console.log(`connected to database ${res}`))
  .catch((err) => console.log(err));


port = 3000
app.listen(port, () => {
    console.log(`app listening to port ${port}`)
});

app.get("/", (req, res) => {
    res.send("project started");
});

// index route
app.get("/listings", async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", {listings});
});

// add route
app.get("/listings/new", (req, res) => {
    res.render("listings/add.ejs");
});


app.post("/listings", async (req, res) => {
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
});

// show route

app.get("/listings/:id", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// update route

app.get("/listings/:id/edit", async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async (req, res) => {
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
});

// delete route

app.delete("/listings/:id", async (req, res) => {
    const {id} = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
