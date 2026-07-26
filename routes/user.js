const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/WrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
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
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome to Stayhub");
        let url = res.locals.redirectUrl || "/listings";
        res.redirect(url);
    }
);

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
});

module.exports = router;
