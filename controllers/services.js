const Chair = require("../models/Chair");
const Service = require("../models/Service");

//Create Service
exports.createService = async(req, res) => {
    try
    {
        const {name, price, chair, expectedTime } = req.body;
        const {userId} = req.user;

        if(!userId || !price || !name || !chair || !expectedTime) 
        {
            return res.status(401).json({
                success: false,
                message : "All Fields are required",
            })
        }

        const newService = await Service.create({
            name : name,
            price : price,
            expectedTime : expectedTime,
            ratingAndReview :  null,
        })
        
        if(!newService)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to create service",
            })
        }

        const fetchChair = await Chair.findById(chair);

        if(!fetchChair)
        {
            return res.status(401).json({
                success: false,
                message: "Unbale to fetch chair details",
            })
        }
        fetchChair.services.push(newService._id);
        await fetchChair.save();

        return res.status(200).json({
            success: true,
            message: "New Service Added",
            newService,
        })


    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again."
        })
    }
}

// update Service
exports.updateService = async(req, res)=>{
    try
    {
        const {serviceId, name, price, expectedTime } = req.body;
        const {userId} = req.user;

        if(!userId || !serviceId || !price || !name || !expectedTime) 
        {
            return res.status(401).json({
                success: false,
                message : "All Fields are required",
            })
        }

        const updatedService = await Service.findById(serviceId);
        if(!updatedService)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch service",
            })
        }
        updatedService.name = name;
        updatedService.price = price;
        updatedService.expectedTime = expectedTime;
        await updatedService.save();

        return res.status(200).json({
            success: true,
            message: "Service Updated Successfully",
            updatedService
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

// delete service
exports.deleteService = async(req, res)=>{
    try
    {
        const {serviceId, chair} = req.body;
        const {userId} = req.user;

        if(!userId || !serviceId || !chair)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }

        // fetch service
        const service = await Service.findById(serviceId);
        if(!service)
        {
            return res.status(400).json({
                success: false,
                message: "Unbale to fetch service details",
            })
        }

        //fetch chair
        const updatedChair = await Chair.findById(chair);
        if(!updatedChair)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to get chair details",
            })
        }
        updatedChair.services.pull(serviceId);
        await updatedChair.save();

        const deleteService = await Service.deleteOne({_id: serviceId});
        if(!deleteService)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to delete service",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Service Deleted Successfully",
            updatedChair,
        })

    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again."
        })
    }
}