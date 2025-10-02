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
    averageRating : {
        type : Number,
        max : 5,
        min : 1,
    },
    ratingCount : {
        type : Number,
        default: 0,
    },
    shop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop",
    }

})

module.exports = mongoose.model("Service", serviceSchema);