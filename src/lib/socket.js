import {Server} from "socket.io";
import http from "http";
import express from "express";

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            process.env.FRONTEND_URL
        ].filter(Boolean),
        methods: ["GET", "POST"]
    }
});

const parseCookies = (cookieHeader) => {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
};

// WebSocket JWT Authentication Middleware
io.use(async (socket, next) => {
    try {
        let token = socket.handshake.auth?.token || socket.handshake.query?.token;
        
        if (!token && socket.handshake.headers?.cookie) {
            const cookies = parseCookies(socket.handshake.headers.cookie);
            token = cookies.jwt;
        }

        if (!token) {
            // Fallback for development only
            if (process.env.NODE_ENV === "development" && socket.handshake.query?.userId) {
                socket.userId = socket.handshake.query.userId.toString();
                return next();
            }
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id.toString();
        next();
    } catch (err) {
        console.error("Socket authentication failed:", err.message);
        if (process.env.NODE_ENV === "development" && socket.handshake.query?.userId) {
            socket.userId = socket.handshake.query.userId.toString();
            return next();
        }
        return next(new Error("Authentication error: Invalid token"));
    }
});

export function getReceiverSocketId(userId) {
    if (!userId) return null;
    const userIdStr = userId.toString();
    return userSocketMap[userIdStr] && userSocketMap[userIdStr].size > 0 ? userIdStr : null;
}

const userSocketMap = {}; // {userIdStr: Set<socketId>}

io.on("connection", (socket) => {
    const userId = socket.userId;
    if (!userId) {
        console.log("Socket connected without userId, disconnecting...");
        socket.disconnect();
        return;
    }

    console.log("A user connected", socket.id, "userId:", userId);

    if (!userSocketMap[userId]) {
        userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    // Join a room unique to the user to easily send messages to all active tabs
    socket.join(userId);

    // Emit the list of all online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id, "userId:", userId);
        if (userSocketMap[userId]) {
            userSocketMap[userId].delete(socket.id);
            if (userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
