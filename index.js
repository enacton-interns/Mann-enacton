import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//db connect
import connect from "./config/connect.js";

//middlewares
import auth from "./middleware/auth.js";
import authorizeRoles from "./middleware/authorizeRoles.js";

//routes
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import providerServiceRoutes from "./routes/providerservices.js";
import bookingsRoutes from "./routes/booking.js";
import feedbackRoutes from "./routes/feedback.js"

//cron-job
import { startBookingCron } from "./jobs/booking.queue.js";


dotenv.config()

connect(process.env.MONGO_URL)
startBookingCron()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes);
app.use("/api/bookings", auth, bookingsRoutes)
app.use("/api/feedback", auth, authorizeRoles("customer"), feedbackRoutes)
app.use("/api/services", auth, serviceRoutes)
app.use("/api/provider/services", auth, authorizeRoles("provider"), providerServiceRoutes)

// Global error handler — must be defined after all routes
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})