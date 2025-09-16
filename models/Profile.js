const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    firstName : {
        type: String,
        trim: true,
    },
    lastName : {
        type: String,
        trim: true,
    },
    email : {
        type : String,
        trim : true,
    },
    password : {
        type : String,
    },
    gender : {
        type : String,
        enum : ["Male", "Female", "Not Prefer To Say"],
    },
    dob : {
        type : Date,
    },
    profilePicture : {
        type : String,
    },
})

module.exports = mongoose.model("Profile", profileSchema);