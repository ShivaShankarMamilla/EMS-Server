import express,{Request,Response} from "express"
import dotenv from "dotenv"
import userRouter from "./routes/userRouter.js"
import { connectToDatabase } from "./config/database.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT ?? 5000;
const MONGOURI = process.env.MONGO_URI as string

//connecting to database
connectToDatabase(MONGOURI)

//MIDDLEWARES
app.use(express.json())

//routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Mploy Server!');
  });

//routes
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });