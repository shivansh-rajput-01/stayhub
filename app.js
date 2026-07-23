require('dotenv').config();

const express = require("express");

const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require('./utils/WrapAsync.js');

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
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


const port = 3000;

app.get("/", (req, res) => {
    res.send("project started");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.use((req, res, next) => {
    next(new ExpressError(400, "Bad request page not found"));
});

app.use((err, req, res, next) => {
    let {status = 500, message = "something went wrong"} = err;
    res.status(status).render("Error.ejs", {message});
});

app.listen(port, () => {
    console.log(`app listening to port ${port}`)
});
