import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

const App = express();
App.use(express.json());
App.use(cookieParser());


const allowedOrigins = ['http://localhost:5173'];

const PORT = process.env.PORT || 5000;
connectDB();

App.use(cors({origin: allowedOrigins, credentials: true}));

//API endpoints


App.get("/", (req, res) => {res.send("Working")});

App.use('/api/auth', authRouter);
App.use('/api/user', userRouter);
App.listen(PORT, () => {
    console.log('listening on port', PORT)
});