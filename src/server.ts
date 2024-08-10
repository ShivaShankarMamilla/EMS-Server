import express,{Request,Response} from "express"
import dotenv from "dotenv"
import userRouter from "./routes/userRouter.js"
// import mongoose from "mongoose"

const app = express()
dotenv.config()


const PORT = process.env.PORT ?? 5000;

//MIDDLEWARES
app.use(express.json())

//routes
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
  });

  app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });