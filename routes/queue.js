const express = require("express");
const router = express.Router();

const {
    joinQueue,
    markAsCompleted,
    remove,
    fetchQueueStatusByPhoneNumber,
    fetchQueueStatus
} = require("../controllers/queue");

const { authentication, isCustomer, isShop } = require("../middlewares/auth");

router.post("/queue/join", authentication, joinQueue);
router.post("/queue/markCompleted", authentication, markAsCompleted);
router.post("/queue/remove", authentication, remove);
router.post("/queue/fetchQueueStatusByPhoneNumber", fetchQueueStatusByPhoneNumber);
router.post("/queue/fetchQueueStatus", authentication, fetchQueueStatus);

module.exports = router;