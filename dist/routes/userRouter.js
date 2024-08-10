import { Router } from "express";
const router = Router();
router.post("/login", (req, res) => {
    res.send("Login route triggered");
});
router.post("/logout", (req, res) => {
    res.send("Logout route triggered");
});
export default router;
