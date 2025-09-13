const mongoose = require("mongoose");

const chairSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    server : {
        type : String,
        required : true,
    },
    experience : {
        type : Number,
        required : true,
    },
    services : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Services",
        required : true,
    }],
    currentWaiting : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "QueueInfo",
        required : true,
    }],
    currentCustomer : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        required : true,
    }
})

module.exports = mongoose.Schema("Chair", chairSchema);