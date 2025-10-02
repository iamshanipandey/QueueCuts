const mongoose = require("mongoose");


const shopSchema = new mongoose.Schema({
    shopName : {
        type : String,
        required: true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    locationLatitude : {
        type : Number,
        required: true,
    },
    locationLongitude : {
        type : Number,
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
    services : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Service",
    }],
    shopAge : {
        type : Number,
        required : true,
    },
    image :{
        type: String,
    },
    ratingAndReview : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReview",
    }],
    averageRating : {
        type : Number,
        max : 5,
        min : 1,
    },
    ratingCount : {
        type : Number,
        default: 0,
    },
    status : {
        type : String,
        enum : ["Online", "Offline"],
        required: true,
    },
})

module.exports = mongoose.model("Shop", shopSchema);