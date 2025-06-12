const express = require("express");
const router = express.Router({mergeParams:true});     //mergeParams is use to get all the info of the route from the parent route. Here it is use to get the id of the particular listing from parent route
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateReview= (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);                          //.validate is a function of joi which returns the info about validation error
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
}

//Reviews 
//create review route
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

//Delete review route
router.delete("/:reviewId", wrapAsync(async(req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


module.exports = router