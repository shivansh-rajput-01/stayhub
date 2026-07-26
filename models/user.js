const mongoose = require("mongoose");

const {Schema} = mongoose;

// passport-local-mogoose helps in adding username and password hash and salt using plugin
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
