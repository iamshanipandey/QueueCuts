const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    shopId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Shop",
        required : true,
    },
    hygineRating : {
        type : Number, 
        required: true,
    },
    shopOwnerBehaviorRating : {
        type : Number, 
        required: true,
    },
    overallRating : {
        type : Number, 
        required: true,
    },
    comment : {
        type : String, 
        required: true,
    },
})

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);