import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.js"
import messageRoutes from "./routes/message.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173/",
    credentials:true,
}));

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port:"+PORT);
    connectDB();
});