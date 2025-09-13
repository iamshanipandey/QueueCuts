const mongoose = require("mongoose");


const shopSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    location : {
        type : String,
        required: true,
    },
    openingTime : {
        type : Date,
        required : true,
    },
    closingTime : {
        type : Date,
        required : true,
    },
    chairs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chair",
        required: true,
    }],
    shopAge : {
        type : Number,
        required : true,
    },
    ratingAndReview : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReview",
        required: true,
    }],
    status : {
        type : String,
        ref : ["Online", "Offline"],
        required: true,
    },
})

module.exports = mongoose.model("Shop", shopSchema);