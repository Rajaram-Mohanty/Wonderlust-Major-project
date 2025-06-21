const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const {storage} = require("../cloudConfig.js")
const multer = require("multer");            // multer is used to parse multipart form data(files like photos pdf etc)
const upload = multer({storage});            // with this multer will store the files in clodinary storage wonderlust_DEV


router.route("/")
// index route
.get(wrapAsync(listingController.index))
// create route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
//show route
.get(wrapAsync(listingController.showListing))
// update route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// edit route (separate, because path is /:id/edit not /:id)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;