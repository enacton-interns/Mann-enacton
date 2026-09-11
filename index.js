import express from "express";
import dotenv from "dotenv";
import connect from "./config/db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js"
import cookieParser from "cookie-parser";
import timeTrackRoutes from "./routes/timeTrack.js"
import isAuth from "./middlewares/isAuth.js";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

// Database Connection
connect(process.env.MONGO_URL)

// Routes
app.use("/auth", authRoutes)
app.use("/projects", isAuth, projectRoutes)
app.use("/timetrack", isAuth, timeTrackRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT:${process.env.PORT}`);
})