const mongoose = require("mongoose");

const serviceCompletedSchema = new mongoose.Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        joinedAt : {
            type : Date,
            default : Date.now(),
            required : true,
        },
        token : {
            type : Number,
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
        completedAt : {
            type : Date,
            required : true,
        },
})

module.exports = mongoose.model("ServiceCompleted", serviceCompletedSchema);