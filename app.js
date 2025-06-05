const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then(() => {
    console.log("connection successful");
})
.catch((err) => {
    console.log("err");
})

async function main() {
    await mongoose.connect(MONGO_URL);            //here we will use the test db
  }



app.set("view engine", "ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);    
app.use(express.static(path.join(__dirname, "/public")));                  //this is used to make separated boilerplate for all the pages that have things in common. but dont confuse it with includes, it is used to have mofularity in the webpages means modules for every section.


app.get("/" ,(req,res) => {
    res.send("hi i am the root");
});


// index route

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})

//Show route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.get("/listings/:id", async(req,res) => {                           //always keep the id route at the last or else other route path will be treated as id by id route 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.post("/listings", async(req, res)=> {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})

app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
})


app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


/* app.get("/testListing", async(req, res) => {
    let sampleListing = new Listing ({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute , Goa",
        country:"India"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
}) */


app.listen(8080, () => {
    console.log("Hey i am the root");
});