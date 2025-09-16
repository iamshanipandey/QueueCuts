const mongoose = require("mongoose");
const messageSender = require("../config/messageSender")

const otpSchema = new mongoose.Schema({
    otp: {
        type : String,
        required: true,
    },
    createdAt : {
        type : Date,
        default: Date.now(),
        expires : 50*60,
    },
    countryCode : {
        type : Number,
        required : true,
    },
    phoneNumber : {
        type : Number,
        required : true,
    },

})

async function sendVerificationCode(countryCode, phoneNumber, otp)
{
    console.log(countryCode, phoneNumber, otp);
    try
    {
        const response = await messageSender({countryCode, phoneNumber, otp});
        console.log("Message Sender Response : ", response)
    }
    catch(error)
    {
        console.log("Message Sender Error : ", error);
    }
}

otpSchema.pre("save", async function (next){
    await sendVerificationCode(this.countryCode, this.phoneNumber, this.otp);
    next();
});

module.exports = mongoose.model("Otp", otpSchema);