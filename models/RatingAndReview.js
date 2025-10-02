const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    queueInfoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "QueueInfo",
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    hygineRating : {
        type : Number, 
        min : 1,
        max: 5,
    },
    shopOwnerBehaviorRating : {
        type : Number, 
        min: 1,
        max: 5,
    },
    overallRating : {
        type : Number,
        required: true, 
        min : 1,
        max : 5,
    },
    comment : {
        type : String, 
        required: true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    isVisible :{
        type : Boolean,
        default: true,
    }
})

ratingAndReviewSchema.index({queueInfoId: 1, userId: 1}, {unique: true})

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);