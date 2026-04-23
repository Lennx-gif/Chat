import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const onlineUsers = new Set();
const socketUserMap = new Map();

io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("join", (userId) => {
        if (!userId) return;
        onlineUsers.add(userId);
        socketUserMap.set(socket.id, userId);
        io.emit("onlineUsers", Array.from(onlineUsers));
        console.log(`User ${userId} joined (socket ${socket.id}). Online count: ${onlineUsers.size}`);
    });

    socket.on("disconnect", () => {
        const userId = socketUserMap.get(socket.id);
        socketUserMap.delete(socket.id);
        if (userId) {
            onlineUsers.delete(userId);
            io.emit("onlineUsers", Array.from(onlineUsers));
            console.log(`User ${userId} disconnected (socket ${socket.id}). Online count: ${onlineUsers.size}`);
        }
        console.log("Client disconnected: " + socket.id);
    });
});

export {io, server,app};