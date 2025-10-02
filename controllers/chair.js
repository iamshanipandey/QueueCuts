const Chair = require("../models/Chair");
const Shop = require("../models/Shop");

// Create chair
exports.createChair = async(req, res) =>{
    try
    {
        const {
            server,
            experience
        } = req.body;

        const {userId} = req.user;

        // validations
        if(!server || !experience || !userId)
        {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            })
        }

        // find shop
        const shop = await Shop.findOne({owner: userId});
        if(!shop)
        {
            return res.status(400).json({
                success: false,
                message: "Invalid shop",
            })
        }

        // add chair
        const chair = await Chair.create({
            server : server,
            experience: experience,
            services : [],
            currentWaiting : [],
            currentCustomer : null,
            status : "Offline",
        })

        if(!chair)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to Add Chair",
            })
        }

        // push chair in shop schema
        shop.chairs.push(chair._id);
        await shop.save();

        const populatedShop = await Shop.findById(shop._id)
                                        .populate("chairs")
                                        .populate("owner")
                                        .exec();

        return res.status(200).json({
            success: true,
            message: "Chair Added Successfully",
            chair, populatedShop
        })
    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again."
        })
    }
}

// update chair
exports.updateChair = async(req, res) =>{
    try
    {
        const {
            chairId,
            server,
            experience,
            status,
        } = req.body;

        const {userId} = req.user;

        // validations
        if(!chairId || !server || !experience || !userId)
        {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            })
        }

        //find chair
        const chair = await Chair.findById(chairId);
        if(!chair)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to get chair details",
            })
        }

        chair.server = server;
        chair.experience = experience;
        chair.status = status;
        await chair.save();
        
        

        const populatedShop = await Shop.findOne({owner:userId})
                                        .populate("chairs")
                                        .populate("owner")
                                        .exec();

        return res.status(200).json({
            success: true,
            message: "Chair updated Successfully",
            chair, populatedShop
        })
    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again."
        })
    }
}

// delete chair
exports.deleteChair = async(req, res) =>{
    try
    {
        const {
            chairId,
        } = req.body;

        const {userId} = req.user;

        // validations
        if(!chairId|| !userId)
        {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            })
        }

        //find chair
        const chair = await Chair.findById(chairId);
        if(!chair)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to get chair details",
            })
        }

        //find and delete chair from shop
        const shop = await Shop.findOne({owner:userId});
        shop.chairs.pull(chairId);
        await shop.save();
        
        // delete chair
        const deleteChair = await Chair.deleteOne({_id:chairId});

        const populatedShop = await Shop.findOne({owner:userId})
                                        .populate("chairs")
                                        .populate("owner")
                                        .exec();

        return res.status(200).json({
            success: true,
            message: "Chair Deleted Successfully",
            populatedShop
        })
    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again."
        })
    }
}