const mongoose = require("mongoose");

const chairSchema = new mongoose.Schema({
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
        ref : "Service",
        required : true,
    }],
    currentWaiting : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "QueueInfo",
        required : true,
    }],
    currentCustomer : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "QueueInfo",
    },
    status : {
        type : String,
        enum : ["Online", "Offline"],
        required : true,
    }
})

module.exports = mongoose.model("Chair", chairSchema);