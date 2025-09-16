const OtpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const Profile = require("../models/Profile")


exports.sendOTP = async(req, res) => {
    try{
        const {phoneNumber, countryCode} = req.body;
        
        
        if(!phoneNumber || !countryCode)
        {
            return res.status(400).json({
                success: false,
                message: "Mobile Number is required",
            })
        }

        let otp = OtpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const payload = {countryCode,phoneNumber, otp};

        const saveOtp = await Otp.create(payload);
        console.log("Paylod : ", payload);

        if(!saveOtp)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to send OTP",
            })
        }

        return res.status(200).json({
            success : true,
            message : "OTP Sent Successfully",
            otp
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message : "Server Error, Try Again"
        })
    }
}

exports.loginOrSignup = async(req, res) =>{
    try{
        const {phoneNumber, countryCode, otp, userType} = req.body;
        console.log(otp);
        if(!phoneNumber || !countryCode || !otp || !userType)
        {
            return res.status(400).json({
                success: false,
                message : "All Field are Required",
            })
        }

        //Fetching OTP From Database
        const recentOTP = await Otp.findOne({phoneNumber}).sort({createdAt:-1}).limit(1);
        console.log("DB Otp : ", recentOTP);

        //Verifying OTP
        if(!recentOTP)
        {
            return res.status(401).json({
                success: false,
                message: "OTP Expired"
            })
        }
       
        if(recentOTP.otp !== otp)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        //check user Exist
        const checkUserExsit = await User.findOne({phoneNumber})
        if(!checkUserExsit)
        {
            const profileDetails = await Profile.create({
                firstName : null,
                lastName: null,
                email : null,
                password : null,
                gender : null,
                dob: null,
                profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=New User`,
                shop : null
            })

            const userDetails = await User.create({
                userType: userType,
                countryCode: countryCode,
                phoneNumber : phoneNumber,
                additionalDetails: profileDetails._id,
                totalServiceTaken: [],
                shop : null,
            })
        }

        //check if user already register with another userType
        if(userType !== checkUserExsit.userType)
        {
            return res.status(401).json({
                success: false,
                message: "Please Select Valid User Type",
            })
        }
       
       const user = await User.findOne({phoneNumber:phoneNumber});

        // Creating Payload for JWT

        const payload = {
            countryCode : countryCode,
            phoneNumber: phoneNumber,
            userId : user._id,
            userType: userType,
        }


        //JBT Token generate
        const token = jwt.sign(payload, process.env.JBT_SECRET, {
            expiresIn: "24h",
        })

        req.body.user = {
            ...user.toObject(),
            token,
        }

        // otpions for cookies

        const options = {
            expires: new Date(Date.now() + 3*24*60*1000),
            httpOnly: true,
        }
        

        //create cookies
        return res.cookie("token", token, options).status(200).json({
            success: true,
            user: req.body.user,
            token, 
            message: "User Logged in",
        })
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message : "Server Error, Try Again.",
        })
    }
}
