import express from "express";
import connect from "./config/connection.js"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import teamRoutes from "./routes/team.route.js"
dotenv.config();

connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})