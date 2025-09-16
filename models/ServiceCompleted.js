const mongoose = require("mongoose");

const serviceCompletedSchema = new mongoose.Schema({
        queueInfo : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "QueueInfo",
            required : true,
        },
        completedAt : {
            type : Date,
            required : true,
        },
})

module.exports = mongoose.model("ServiceCompleted", serviceCompletedSchema);