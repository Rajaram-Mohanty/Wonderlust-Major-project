const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");  // this is plugin used in defining and encrypting differnt info like username or password of the model.


const userSchema = new Schema({         
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);         //by default passport-local-mongoose will add username and password into schema. To use the feature we have to use plugin.

module.exports = mongoose.model('User', userSchema);

