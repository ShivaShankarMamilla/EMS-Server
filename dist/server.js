var _a;
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import { connectToDatabase } from "./config/database.js";
const app = express();
dotenv.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
const MONGOURI = process.env.MONGO_URI;
//connecting to database
connectToDatabase(MONGOURI);
//MIDDLEWARES
app.use(express.json());
//routes
app.get('/', (req, res) => {
    res.send('Welcome to Mploy Server!');
});
//routes
app.use('/api/users', userRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
