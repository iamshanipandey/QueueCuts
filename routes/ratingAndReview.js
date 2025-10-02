const express = require("express");
const router = express.Router();

const {
    ratingAndReview,
} = require("../controllers/ratingAndReview");

const {
    authentication,
    isShop,
    isCustomer,
    isAdmin,
} = require("../middlewares/auth");

router.post("/ratingandreview",authentication, ratingAndReview);

module.exports = router;