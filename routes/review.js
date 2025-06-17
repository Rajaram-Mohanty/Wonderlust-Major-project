const express = require("express");
const router = express.Router({mergeParams:true});     //mergeParams is use to get all the info of the route from the parent route. Here it is use to get the id of the particular listing from parent route
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");



//Reviews 
//create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
}))

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req,res) => {
    let {id, reviewId} = req.params;                                       
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}))


module.exports = router