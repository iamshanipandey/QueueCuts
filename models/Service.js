const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    price : {
        type : String,
    },
    expectedTime : {
        type : String,
    },
    ratingAndReview : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReview",
    }],

})

module.exports = mongoose.model("Service", serviceSchema);