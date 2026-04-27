import express from "express";
import dotenv from "dotenv";
dotenv.config();

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.js"
import messageRoutes from "./routes/message.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app} from "./lib/socket.js";
const PORT = process.env.PORT || 5000;


app.use(express.json({
    limit:"50mb"
}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true,
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

server.listen(PORT, () => {
    console.log("Server is running on port:"+PORT);
    connectDB();
});