const express = require("express");
const app = express();

const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         credentials: true
//     })
// )

app.get("/", (req, res)=>{
    return res.status(200).json(
        {
            success: true,
            message: "Server is up and Running"
        }
    )
})

app.listen(PORT, ()=>{
    console.log(`App is running at PORT ${PORT}`)
})