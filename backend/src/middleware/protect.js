import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
// Middleware to protect routes

export const protectRoute = asyncHandler(async (req, res, next) => {;
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }
        req.user = User;
        // Attach the user to the request object
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
});