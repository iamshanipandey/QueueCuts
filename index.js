const express = require("express");
const app = express();
const dotenv = require("dotenv");
const database = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//api
const authRoutes = require("./routes/auth")
const shopRoutes = require("./routes/shop");
const chairRoutes = require("./routes/chair");
const serviceRoutes = require("./routes/service");
const queueRoutes = require("./routes/queue");
const ratingAndReviewRouters = require("./routes/ratingAndReview");

// Database Connection
database.connect();
// Cloudinary Connection
cloudinaryConnect();


dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)
app.use(express.json());
app.get("/", (req, res)=>{
    return res.status(200).json(
        {
            success: true,
            message: "Server is up and Running"
        }
    )
})
app.use("/api/v1",authRoutes);
app.use("/api/v1",shopRoutes);
app.use("/api/v1",chairRoutes);
app.use("/api/v1",serviceRoutes);
app.use("/api/v1",queueRoutes);
app.use("/api/v1",ratingAndReviewRouters);

app.listen(PORT, ()=>{
    console.log(`App is running at PORT ${PORT}`)
})