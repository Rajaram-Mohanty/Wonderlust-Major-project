const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


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


module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing= (req, res, next) => {
    let {error} = listingSchema.validate(req.body);                          //.validate is a function of joi which returns the info about validation error
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
}

module.exports.validateReview= (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);                          //.validate is a function of joi which returns the info about validation error
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
// In req we have a lots of info saved 
// req.path ->stores the path we wanted to enter into like /new.
// req.originalUrl -> stores the complete url of the path like /listings/new
