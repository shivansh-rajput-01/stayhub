require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const sample = require("./data.js");
url = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(url);
}

main()
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log(err));

async function init(){
    await Listing.deleteMany({});
    await Listing.insertMany(sample.data);
}

init();
