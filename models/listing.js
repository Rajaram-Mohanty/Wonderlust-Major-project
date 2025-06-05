const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

        //the above default is used to when we get no image but set default image is used when we get an image but it is empty.
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v

    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;