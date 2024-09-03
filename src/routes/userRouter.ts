import { Router } from "express";
import { registerController,loginController,logoutController } from "../controllers/userController.js";
import { sendOtpController,verifyOtpController,requestPasswordResetController,resetPasswordController } from "../controllers/otpauthController.js";

const router = Router()

router.post("/login",loginController)
router.post("/send-otp",sendOtpController)
router.post("/verify-otp",verifyOtpController)
router.post('/request-password-reset', requestPasswordResetController);
router.post('/reset-password', resetPasswordController);

router.post("/logout",logoutController)
router.post("/register",registerController)
export default router