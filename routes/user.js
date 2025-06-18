const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");                   // the hashing algorithm used in passport is pbkdf2
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");
const user = require("../models/user.js");

// Note:- 
// Sign up => Add the the user info in the DATABASE of application but not yet given the access to use the all features of application.
// Login => Add the user info into the SESSION and give access to the user to use all the features of the application by checking the user info with the Signup details of user in database.


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect:"/login",failureFlash:true}),userController.login);


router.get("/logout",userController.logout);


module.exports = router;