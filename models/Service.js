const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    price : {
        type : String,
        required : true,
    },
    chair : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chair",
        required : true,
    },
    expectedTime : {
        type : Date,
        required : true,
    },
    RatingAndReview : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReview",
        required: true,
    }],

})

module.exports = mongoose.Schema("Service", serviceSchema);