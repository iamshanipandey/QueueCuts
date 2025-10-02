const Shop = require("../models/Shop");
const Chair = require("../models/Chair");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { imageUploader } = require("../config/imageUploader");

// Create new Shop
exports.createShop = async(req, res)=>{
    try
    {
        const {firstName, lastName, email, gender, shopName, locationLatitude, locationLongitude, openingTime, closingTime, shopAge} = req.body;
        const {userId} = req.user;
        const image = req.files.image;
        if(!userId || !firstName || !lastName || !gender || !shopName || !locationLatitude || !locationLongitude || !openingTime || !closingTime || !shopAge)
        {
            return res.status(401).json({
                success: false,
                message: "All Fields are required",
            })
        }

        const shop = await Shop.findOne({owner: userId});
        if(shop)
        {
            return res.status(401).json({
                success: false,
                message: "Shop Alrady Created",
                shop,
            })
        }
        const uploadImage = await imageUploader(image, process.env.FOLDER_NAME);
        const newShop = await Shop.create({
            shopName : shopName,
            owner : userId,
            locationLatitude : locationLatitude,
            locationLongitude : locationLongitude,
            openingTime : openingTime,
            closingTime : closingTime,
            chairs : [],
            services: [],
            shopAge : shopAge,
            image : uploadImage.secure_url,
            status : "Offline"
        })

        if(!newShop)
        {
            return res.status(400).json({
                success : false,
                message : "Unable to create shop",
            })
        }

        // get user
        const user = await User.findById(userId);

        // update additional details
        const profile = await Profile.findById(user.additionalDetails);
        if(!profile)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to update profile details",
            })
        }

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.email = email;
        profile.gender = gender;
        profile.password = null;
        profile.dob = null;
        profile.profilePicture = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
        await profile.save();

        // update user with shop id and additionalDetails 
        user.shop = newShop._id;
        user.additionalDetails = profile._id;
        await user.save();

        const populatedShop = await Shop.findById(newShop._id)
                                            .populate("owner")
                                            .populate("chairs")
                                            .exec();

        console.log(newShop);
        return res.status(200).json({
            success: true,
            message : "Shop Created Successfully",
            populatedShop,
        })
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again",
        })
    }
}

//Update shop
exports.updateShop = async(req, res) =>{
    try
    {
        const {shopId,firstName, lastName, email, gender, shopName, locationLatitude, locationLongitude, openingTime, closingTime, shopAge} = req.body;
        const {userId} = req.user;
        const image = req?.files?.image;
        if(!userId || !firstName || !lastName || !gender  || !shopId || !shopName || !locationLatitude || !locationLongitude || !openingTime || !closingTime || !shopAge)
        {
            return res.status(401).json({
                success: false,
                message: "All Fields are required",
            })
        }

        const shop = await Shop.findById(shopId);
        if(!shop)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid Shop",
            })
        }
    
        if(image)
        {
            const uploadImage = await imageUploader(image, process.env.FOLDER_NAME);
            shop.shopName = shopName;
            shop.locationLatitude = locationLatitude;
            shop.locationLongitude = locationLongitude;
            shop.openingTime = openingTime;
            shop.closingTime = closingTime;
            shop.shopAge = shopAge;
            shop.image = uploadImage.secure_url;
            await shop.save();
        }
        else
        {
            shop.shopName = shopName;
            shop.locationLatitude = locationLatitude;
            shop.locationLongitude = locationLongitude;
            shop.openingTime = openingTime;
            shop.closingTime = closingTime;
            shop.shopAge = shopAge;
            await shop.save();
        }
        // get user
        const user = await User.findById(userId);

        // update additional details
        const profile = await Profile.findById(user.additionalDetails);
        if(!profile)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to update profile details",
            })
        }

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.email = email;
        profile.gender = gender;
        profile.password = null;
        profile.dob = null;
        profile.profilePicture = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
        await profile.save();

        const populatedShop = await Shop.findById(shopId)
                                        .populate("owner")
                                        .populate("chairs")
                                        .exec();

        return res.status(200).json({
            success: true,
            message: "Shop Updated Successfully",
            populatedShop,
        })

    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again.",
        })
    }
}

