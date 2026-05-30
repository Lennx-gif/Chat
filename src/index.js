import express from "express";
import dotenv from "dotenv";
dotenv.config();

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.js"
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
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
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port:"+PORT);
    connectDB();
});