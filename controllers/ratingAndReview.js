const mongoose = require("mongoose");
const RatingAndReview = require("../models/RatingAndReview");
const Service = require("../models/Service");
const Shop = require("../models/Shop");
const ServiceCompleted = require("../models/ServiceCompleted");

exports.ratingAndReview = async(req, res) =>{
    try{
        const {queueId, hygineRating, shopOwnerBehaviorRating, overallRating,comment, isVisible} = req?.body;
        const userId = req?.user?.userId;

        // Validation
        if(!queueId ||!userId || !overallRating)
        {
            return res.status.json({
                success: false,
                message: "All Fields are required",
            })
        }

        // Validate Queue
        const queue = await ServiceCompleted.findById(queueId);
        if(!queue)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to find queue details",
            })
        }

        // check is service completed
        if(queue.status != "Completed")
        {
            return res.status(401).json({
                success: false,
                message : "Service not completed",
            })
        }

        // check if alrady review captured
        const checkReview = await RatingAndReview.findOne({queueInfoId: queueId, userId: userId})
        if(checkReview)
        {
            return res.status(401).json({
                success: false,
                message : "Review Already Captured",
            })
        };

        const updatedData = {};
        if(overallRating !== null && overallRating !== undefined) updatedData.overallRating = overallRating;
        if(hygineRating !== null && hygineRating !== undefined) updatedData.hygineRating = hygineRating;
        if(shopOwnerBehaviorRating !== null && shopOwnerBehaviorRating !== undefined) shopOwnerBehaviorRating.shopOwnerBehaviorRating = shopOwnerBehaviorRating;
        // if(isVisible !== null && isVisible !== undefined) updatedData.isVisible = isVisible;

        // update ratinggAndReview
        const ratingReview = await RatingAndReview.create({
            queueInfoId: queueId,
            userId : userId,
            comment: comment,
            ...updatedData
            
        });
        if(!ratingReview)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to create rating and review",
            })
        }

        //find service
        const service = await Service.findById(queue.serviceId);
        if(!service)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to get service details",
            })
        }

        // get avg Rating
        const ratings = [hygineRating, overallRating, shopOwnerBehaviorRating];
        const validRatings = ratings.filter(r=> r!== null && r!== undefined).map(Number);
        const ratingSum = validRatings.reduce((acc, r) =>acc + r, 0);
        const avgRating = validRatings.length > 0 ? parseFloat((ratingSum/validRatings.length).toFixed(1)) : null;

        // update rating in service
        if(service.ratingCount === 0)
        {
            service.ratingAndReview = ratingReview._id;
            service.averageRating = avgRating;
            service.ratingCount = 1;
            await service.save();
        }
        else{
            service.ratingAndReview = ratingReview._id;
            console.log("Average Rating : ", (service.averageRating+avgRating)/(service.ratingCount+1) );
            service.averageRating = parseFloat((service.averageRating+avgRating)/(service.ratingCount+1)).toFixed(1);
            service.ratingCount += 1;
            await service.save();
        }
        // update shop rating
        const shop = await Shop.findById(service.shop);
        if(!shop)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to get shop details",
            })
        }

        if(shop.ratingCount === 0)
        {
            shop.ratingAndReview = ratingReview._id;
            shop.averageRating = avgRating;
            shop.ratingCount = 1;
            await shop.save();
        }

        else{
            shop.ratingAndReview = ratingReview._id;
            shop.averageRating = (shop.averageRating+avgRating)/(shop.ratingCount+1);
            shop.ratingCount += 1;
            await shop.save();
        }
        return res.status(200).json({
            success : true,
            message : "Rating Captured",
        })

    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message : "Server Error, Try Again",
        })
    }
}