import { Router } from "express"
import { handleLogin, handleLogout, handleRegister, handleRefresh, handleGetProfile } from "../controllers/user.js"
import auth from "../middleware/auth.js"
import validate from "../middleware/validate.js"
import { registerSchema, loginSchema } from "../validators/auth.validator.js"

const router = Router()

router.post("/register", validate(registerSchema), handleRegister)
router.post("/login", validate(loginSchema), handleLogin)

router.post("/refresh", handleRefresh)
router.post("/logout", auth, handleLogout)

router.get("/profile", auth, handleGetProfile)

export default router