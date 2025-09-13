const mongoose = require("mongoose");

const queueInfoSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    joinedAt : {
        type : Date,
        required : true,
    },
    status : {
        type : String,
        enum : ["Waiting", "Completed", "Serving", "Out"],
        required : true,
    },
    serviceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Service",
        required: true,
    },
    pricePaid : {
        type : Number,
        required : true,
    },
})

module.exports = mongoose.Schema("QueueInfo", queueInfoSchema);