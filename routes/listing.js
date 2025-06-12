const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


const validateListing= (req, res, next) => {
    let {error} = listingSchema.validate(req.body);                          //.validate is a function of joi which returns the info about validation error
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
}

// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})
)

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async(req,res) => {                           //always keep the id route at the last or else other route path will be treated as id by id route 
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
})
);

// create route
router.post("/", validateListing, wrapAsync(async(req, res, next)=> {
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
})
);

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
)

// update route
router.put("/:id", validateListing, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
})
);

//delete route
router.delete("/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);        //findByIdAndDelete will also call a middleware which is defined in the listing.js file
    console.log(deletedListing);                                     //and the particular listing with the extracted id is received as parameter in the post route in listing.js
    res.redirect("/listings");
})
);

module.exports = router;