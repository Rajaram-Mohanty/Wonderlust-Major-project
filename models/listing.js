const mongoose = require("mongoose");
const review = require("./review");
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
        url: String,
        filename: String

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});


listingSchema.post("findOneAndDelete", async(listing) => {                    //this is a special mongodb middleware to delete a database before or after deleting another database using .pre or .post .
    if(listing){
        console.log(listing);
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;