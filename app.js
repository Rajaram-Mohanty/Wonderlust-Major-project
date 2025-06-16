const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");  
const flash = require("connect-flash");




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


const sessionOptions = {                         // this is used to implement cookie in sessionOptions
    secret: "mysupersecretcode",
    resave: false,                                //Don’t save the session to the store if it wasn’t modified during the request.
    saveUninitialized: true,                      //A new session object is saved in the store, even if nothing has been set in the session.
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,    //this basically says that the cookie will remain for 7days from the time the site is opened.
        maxAge: 7 * 24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));           // A session is a way to store information (data) about a user across multiple HTTP requests like the user login will be saved for certail time for the user convenience.
app.use(flash());

app.get("/demouser", async(req,res) => {
    let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");     //this will save the fakeUser with password helloworld. It also checks if username is unique
    res.send(registeredUser);
})


app.get("/" ,(req,res) => {
    res.send("hi i am the root");
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");               //before rendering any view, you pass this to res.locals
    next();                                           //next() is used to send the control again to the render
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

