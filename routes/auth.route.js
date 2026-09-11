import { Router } from "express";
import { handleGetProfile, handleLogin, handleLogout, handleRegister } from "../controllers/auth.controller.js";
import isAuth from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", handleRegister)
router.post("/login", handleLogin)
router.get("/profile", isAuth, handleGetProfile)
router.post("/logout", isAuth, handleLogout)

export default router;