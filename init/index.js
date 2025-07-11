const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")


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

const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"685017f8e922771dfa4f8443"}));
    await Listing.insertMany(initData.data );
    console.log("data was initialised");
}

initDB();

