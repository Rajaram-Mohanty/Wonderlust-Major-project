const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");                   // the hashing algorithm used in passport is pbkdf2
const {saveRedirectUrl} = require("../middleware.js");

// Note:- 
// Sign up => Add the the user info in the DATABASE of application but not yet given the access to use the all features of application.
// Login => Add the user info into the SESSION and give access to the user to use all the features of the application by checking the user info with the Signup details of user in database.



router.get("/signup", (req,res)=> {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res) => {
    try{
    let {username, email, password} =req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {                                //req.login is a method of passport. It uses serialize and deserialize method to store the user info in the session.
        if(err) {
            return next(err);

        }
        req.flash("success", "Welcome to Wonderlust");
        res.redirect("/listings");
    })
    
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res)=> {
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect:"/login",failureFlash:true}),async(req,res)=>{          //local is one of the way we used to implement authentication similar to sign up with linked in. failureFlash handles the error and flashes the message so no try catch required here.
    req.flash("success","Welcome back to Wonderlust! You are logged in !");
    let redirectUrl =res.locals.redirectUrl || "/listings";                    //as isLoggedin is not triggered it will not save the info of originalUrl in middleware.js. So we have used the or operator
    res.redirect(redirectUrl);
})


router.get("/logout",(req,res,next)=> {
    req.logout((err) => {                    //req.logout is a method of passport. It uses serialize and deserialize method to remove the user infos when the user logout.
    if(err){
        return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
    });
});


module.exports = router;