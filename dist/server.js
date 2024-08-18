var _a;
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import mongoose from "mongoose";
const app = express();
dotenv.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
const MONGOURI = process.env.MONGO_URI;
//MIDDLEWARES
app.use(express.json());
mongoose.connect(MONGOURI)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
});
//routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/users', userRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
