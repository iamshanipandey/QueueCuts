const User = require("../models/User");
const Service = require("../models/Service");
const Chair = require("../models/Chair");
const QueueInfo = require("../models/QueueInfo");
const todayDateIST = require("../config/dateFormator");
const Token = require("../models/Token");
const ServiceCompleted = require("../models/ServiceCompleted");

exports.joinQueue = async(req, res) => {
    try
    {
        const {userId} = req.user;
        const {pricePaid, serviceId, chairId} = req.body;
        const date = todayDateIST();

        if(!userId || !pricePaid || !serviceId || !date)
        {
            return res.status(400).json({
                success: false,
                message : "All Fields are required",
            })
        }

        // validate user
        const user = await User.findById(userId);
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message : "User not found"
            })
        }

        // check already joined 
        const checkQueue = await QueueInfo.findOne({userId: userId});
        if(checkQueue)
            {
                return res.status(401).json({
                    success : false,
                    message: "Already one queue joined",
                })
            }
        
        // validate service
        const service = await Service.findById(serviceId);
        if(!service)
        {
            return res.status(401).json({
                success: false,
                message : "Service not found"
            })
        }

        // validate chair
        const chair = await Chair.findById(chairId);
        if(!chair)
        {
            return res.status(401).json({
                success: false,
                message : "Chair not found"
            })
        }

        if(chair.status == "Offline")
        {
            return res.status(401).json({
                success: false,
                message : "Chair is offline",
            })
        }


        const tokenGenerate = await Token.findOneAndUpdate(
            {chairId, date},
            {
                $inc : {token: 1}
            },
            {new : true, upsert: true}
        )

        const token = tokenGenerate.token;

        console.log("Token : ", token);

        const queueJoin = await QueueInfo.create({
            userId : userId,
            serviceId: serviceId,
            token : token,
            status : "Waiting",
            pricePaid: pricePaid,
            joinedAt : Date.now(),
        })

        // update chair customer
        chair.currentWaiting.push(queueJoin._id);
        await chair.save();

        // mark current customer
        if(!chair.currentCustomer)
        {
            chair.currentCustomer = chair.currentWaiting[0];
            chair.currentWaiting.shift();
            await chair.save();
            queueJoin.status = "Serving";
            await queueJoin.save();
        }

        return res.status(200).json({
            sucess: true,
            message : "Queue Joined",
            queueJoin
        })
        

    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message : "Server Error, Try Again."
        })
    }
}

exports.markAsCompleted = async(req, res) =>{
    try
    {
        const userId = req.user.userId;
        const {chairId} = req.body;

        // validation
        if(!userId || !chairId) 
        {
            return res.status(400).json({
                success: false,
                message : "All Fields are required",
            })
        }
        
        //fetch Queue
        const queueInfo = await QueueInfo.findOne({userId: userId});
        if(!queueInfo)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch Queue Details",
            })
        }

        //fetch chair
        const chair = await Chair.findById(chairId);
        if(!chair)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch Chair Details",
            })
        }

        // add to ServiceCompleted
        const serviceCompleted = await ServiceCompleted.create({
            userId : queueInfo.userId,
            joinedAt : queueInfo.joinedAt,
            token : queueInfo.token,
            status : "Completed",
            serviceId : queueInfo.serviceId,
            pricePaid : queueInfo.pricePaid,
            completedAt : Date.now(),
        })

        if(!serviceCompleted)
        {
            return res.status(401).json({
                success: false,
                message: "Unable Complete Service",
            })
        }

        // update waiting to serving
        if(chair.currentWaiting[0])
        {
            const currentCustomerQueueInfo = await QueueInfo.findById(chair.currentWaiting);
            console.log("CURENTCUSTOMERQUEUEINFO ", currentCustomerQueueInfo)
            currentCustomerQueueInfo.status = "Serving";
            await currentCustomerQueueInfo.save();
        }
        

        // update chair
        if(chair.currentWaiting[0])
        {
            chair.currentCustomer = chair.currentWaiting[0];
            chair.currentWaiting.shift();
            await chair.save();
        }
        else
        {
            chair.currentCustomer = null;
            await chair.save();
        }
        

        // delete QueueInfo
        const deleteQueueInfo = await QueueInfo.deleteOne({userId: userId}, {new : true});

        return res.status(200).json({
            success: true,
            message : "Mark Completed",
            deleteQueueInfo
        })

    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message : "Server Error, Try Again."
        })
    }
}

exports.remove = async(req, res) =>{
    try
    {
        const userId = req.user.userId;
        const {chairId} = req.body;

        // validation
        if(!userId || !chairId) 
        {
            return res.status(400).json({
                success: false,
                message : "All Fields are required",
            })
        }
        
        //fetch Queue
        const queueInfo = await QueueInfo.findOne({userId: userId});
        if(!queueInfo)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch Queue Details",
            })
        }

        //fetch chair
        const chair = await Chair.findById(chairId);
        if(!chair)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch Chair Details",
            })
        }

        // update waiting to serving
        const currentCustomerQueueInfo = await QueueInfo.findById(chair.currentWaiting);
        currentCustomerQueueInfo.status = "Serving";
        await currentCustomerQueueInfo.save();

        // update chair
        if(chair.currentWaiting)
        {
            chair.currentCustomer = chair.currentWaiting[0];
        }
        chair.currentWaiting.shift();
        await chair.save();

        // delete QueueInfo
        const deleteQueueInfo = await QueueInfo.deleteOne({userId: userId}, {new : true});

        return res.status(200).json({
            success: true,
            message : "Mark Remove",
            deleteQueueInfo
        })

    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message : "Server Error, Try Again."
        })
    }
}

exports.fetchQueueStatusByPhoneNumber = async (req, res) =>{
    try
    {
        const {phoneNumber} = req.body;
        if(!phoneNumber)
        {
            return res.status(400).json({
                success: false,
                message : "All Fields are required",
            })
        }

        // fetch user
        const user = await User.findOne({phoneNumber : phoneNumber});
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message : "User not found",
            })
        }

        const queueInfo = await QueueInfo.findOne({userId : user._id})
                                .populate("userId")
                                .populate("serviceId");
        if(!queueInfo)
        {
            return res.status(401).json({
                success: false,
                message : "No Active Queue Found!",
            })
        }

        
        // find chair
        const chair = await Chair.findOne({$or:[{currentWaiting:queueInfo._id},{currentCustomer:queueInfo._id}]})
                            .populate("currentWaiting")
                            .populate("currentCustomer")
                            .populate("services")
                            .exec();
        if(!chair)
        {
            return res.status(401).json({
                success: false,
                message : "Unable to find your chair",
            })
        }

        return res.status(200).json({
            success: true,
            message : "Queue Status Fetched",
            chair, queueInfo

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

exports.fetchQueueStatus = async (req, res) =>{
    try
    {
        const userId = req.user.userId;
        if(!userId)
        {
            return res.status(400).json({
                success: false,
                message : "All Fields are required",
            })
        }

        // fetch user
        const user = await User.findById(userId);
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message : "User not found",
            })
        }

        const queueInfo = await QueueInfo.findOne({userId : user._id})
                                .populate("userId")
                                .populate("serviceId");
        if(!queueInfo)
        {
            return res.status(401).json({
                success: false,
                message : "No Active Queue Found!",
            })
        }
        
        // find chair
        const chair = await Chair.findOne({$or:[{currentWaiting:queueInfo._id},{currentCustomer:queueInfo._id}]})
                            .populate("currentWaiting")
                            .populate("currentCustomer")
                            .populate("services")
                            .exec();
        if(!chair)
        {
            return res.status(401).json({
                success: false,
                message : "Unable to find your chair",
            })
        }

        return res.status(200).json({
            success: true,
            message : "Queue Status Fetched",
            chair, queueInfo

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
