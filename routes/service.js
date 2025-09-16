const express = require("express");
const router = express.Router();


const { 
    createService,
    updateService,
    deleteService, } = require("../controllers/services");

const {
    authentication,
    isCustomer,
    isShop,
    isAdmin, } = require("../middlewares/auth");


router.post("/service/create", authentication, isShop, createService);
router.post("/service/update", authentication, isShop, updateService);
router.post("/service/delete", authentication, isShop, deleteService);

module.exports = router;
