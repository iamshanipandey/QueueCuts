const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userType : {
        type : String,
        enum : ["Shop","Customer","Admin"],
        require: true,
    },
    countryCode : {
        type : Number,
        required : true,
    },
    phoneNumber : {
        type : Number,
        required: true,
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
    },
    totalServiceTaken : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "ServiceCompleted",
    }],
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop",
    }
})

module.exports = mongoose.model("User", userSchema)