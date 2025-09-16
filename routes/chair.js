const express = require("express")
const router = express.Router();

const {
    createChair,
    updateChair,
    deleteChair
} = require("../controllers/chair")

const {
    authentication,
    isShop,
    isCustomer,
    isAdmin,
} = require("../middlewares/auth");

router.post("/chair/create", authentication, isShop, createChair);
router.post("/chair/update", authentication, isShop, updateChair);
router.post("/chair/delete", authentication, isShop, deleteChair);

module.exports = router;