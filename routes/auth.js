import { Router } from "express";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleGetProfile,
  handleGetUserById
} from "../controllers/auth.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router()

router.post("/register", handleRegister)
router.post("/login", handleLogin)
router.post("/logout", isAuth, handleLogout)

router.get("/profile", isAuth, handleGetProfile)
router.get("/user/:id", handleGetUserById)

export default router