const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})
)

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async(req,res) => {                           //always keep the id route at the last or else other route path will be treated as id by id route 
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {path: "author"}           //this will also show the author info of the review. And this is called nested populate
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
})
);

// create route
router.post("/", validateListing, wrapAsync(async(req, res, next)=> {
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
})
);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
)

// update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated");
    res.redirect("/listings");
})
);

//delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);        //findByIdAndDelete will also call a middleware which is defined in the listing.js file
    console.log(deletedListing);                                     //and the particular listing with the extracted id is received as parameter in the post route in listing.js
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
})
);

module.exports = router;