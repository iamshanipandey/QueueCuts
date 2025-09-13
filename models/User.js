const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true,
        trim: true,
    },
    userType : {
        type : String,
        enum : ["Shop","Customer","Admin"],
        require: true,
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true,
    },
    profilePicture : {
        type : String,
        required : true,
    },
    totalServiceTaken : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "CompletedServices",
    }],
    password: {
        type : String,
    },
})

module.exports = mongoose.model("User", userSchema)