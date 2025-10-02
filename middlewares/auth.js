const jwt = require("jsonwebtoken")

// Token Authentication
exports.authentication = async(req, res, next) =>{
    try
    {
        
        const token = req.body.token || req.cookies.token || 
                      req.header("autherization").replace("Bearer ","");

        if(!token)
        {
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            })
        }

        //decode token

        try
        {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode;
            console.log(req.user);

        }
        catch(error)
        {
            console.log(error.message);
            return res.status(400).json({
                success: false,
                message: "Invalid Token",
            })
        }

        next();
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error, Try Again"
        })
    }
}

// Check is User Customer
exports.isCustomer = async(req, res, next) =>{
    try
    {
        const {userType} = req.user;

        if(!userType)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to indentify",
            })
        }

        if(userType !== "Customer")
        {
            return res.status(400).json({
                success: false,
                message: "This is protected route, only for Customer",
            })
        }

        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified, Try again."
        })
    }
}

// Check is user shop
exports.isShop = async(req, res, next) =>{
    try
    {
        const {userType} = req.user;

        if(!userType)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to indentify",
            })
        }

        if(userType !== "Shop")
        {
            return res.status(400).json({
                success: false,
                message: "This is protected route, only for Shop",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified, Try again."
        })
    }
}

//Check is user Admin
exports.isAdmin = async(req, res, next) =>{
    try
    {
        const {userType} = req.user;

        if(!userType)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to indentify",
            })
        }

        if(userType !== "Admin")
        {
            return res.status(400).json({
                success: false,
                message: "This is protected route, only for Admin",
            })
        }

        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified, Try again."
        })
    }
}
