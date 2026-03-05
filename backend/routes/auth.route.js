import { Router } from "express";
import {
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
