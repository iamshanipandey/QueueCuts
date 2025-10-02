const mongoose = require("mongoose");

const token = new mongoose.Schema({
    chairId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chair",
        required : true,
    },
    date : {
        type : String,
        required : true,
    },
    token : {
        type : Number,
        default : 0,
    }
})


token.index({chairId: 1, date: 1}, {unique : true});

module.exports = mongoose.model('Token', token);