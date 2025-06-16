const { listingSchema } = require("./schema");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/listings");
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next) => {            //passport by default removes all the info of the session(originalUrl also) after a user logins to the application so  we can store it in the locals and export it if needed.
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// In req we have a lots of info saved 
// req.path ->stores the path we wanted to enter into like /new.
// req.originalUrl -> stores the complete url of the path like /listings/new
