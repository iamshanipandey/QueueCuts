const express = require("express");
const app = express();
const dotenv = require("dotenv");
const database = require("./config/database");
const authRoutes = require("./routes/auth")
const shopRoutes = require("./routes/shop");
const chairRoutes = require("./routes/chair");
const serviceRoutes = require("./routes/service");



// Database Connection
database.connect();

dotenv.config();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, ()=>{
    console.log(`App is running at PORT ${PORT}`)
})