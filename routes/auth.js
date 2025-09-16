const express = require("express")
const router = express.Router();

const {
    sendOTP,
    loginOrSignup
} = require("../controllers/authentication")

//****************************************************************************************************************** */
//                                              Authentication Routes
//****************************************************************************************************************** */

router.post("/auth/sendOTP",sendOTP);
router.post("/auth/loginOrSignup", loginOrSignup);

module.exports = router;