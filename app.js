const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
app.set("views", path.join(__dirname , "views"));               //Express will look inside this folder to find files to render while using res.render().
app.use(express.urlencoded({extended: true}));                  //This is a middleware that parses incoming form data when post or put request is used.
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);                                     //This line sets up ejsMate as the rendering engine for .ejs files.
app.use(express.static(path.join(__dirname, "/public")));                  //this is used to make separated boilerplate for all the pages that have things in common. but dont confuse it with includes, it is used to have mofularity in the webpages means modules for every section.


app.get("/" ,(req,res) => {
    res.send("hi i am the root");
});

app.use("/listings", listings);                 //parent route

app.use("/listings/:id/reviews",reviews);       //parent route. to pass the id of listing mergeParams is used in review.js


app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page not found."));
});

app.use((err, req, res, next) => {
    let{ statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
});

app.listen(8080, () => {
    console.log("Hey i am the root");
});

