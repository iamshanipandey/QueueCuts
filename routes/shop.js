const express = require("express")
const router = express.Router();

const {
    createShop,
    updateShop,
} = require("../controllers/shop");
const {
    authentication,
    isShop,
    isCustomer,
    isAdmin,
} = require("../middlewares/auth");

router.post("/shop/create",authentication, isShop, createShop);
router.post("/shop/update",authentication, isShop, updateShop);

module.exports = router;