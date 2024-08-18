import { Router } from "express";
import { registerController,loginController } from "../controllers/userController.js";
import { sendOtpController } from "../controllers/otpauthController.js";

const router = Router()

router.post("/login",loginController)
router.post("/send-otp",sendOtpController)
router.post("/logout",(req,res)=>{
    res.send("Logout route triggered")
})
router.post("/register",registerController)
export default router