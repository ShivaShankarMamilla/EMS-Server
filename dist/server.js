var _a;
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
// import mongoose from "mongoose"
const app = express();
dotenv.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
//MIDDLEWARES
app.use(express.json());
//routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/users', userRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
