const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {                           //always keep the id route at the last or else other route path will be treated as id by id route 
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }           //this will also show the author info of the review. And this is called nested populate
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing.image.url);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_300");                   //this is used from image transfromation to decrease the quality of image and show as a preview.
    res.render("listings/edit.ejs", { listing, originalImageUrl } );
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file != "undefined") {                          //if no image is given while edit then the previous image will only be saved
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);        //findByIdAndDelete will also call a middleware which is defined in the listing.js file
    console.log(deletedListing);                                     //and the particular listing with the extracted id is received as parameter in the post route in listing.js
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};

