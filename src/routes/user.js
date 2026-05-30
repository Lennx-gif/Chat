import express from "express";
import { protectRoute } from "../middleware/protect.js";
import { addToChatList, removeFromChatList, getChatList, searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

// Get the user's dedicated chat list
router.get("/chatlist", protectRoute, getChatList);

// Add a user to the dedicated chat list
router.post("/chatlist/add", protectRoute, addToChatList);

// Remove a user from the dedicated chat list
router.delete("/chatlist/remove/:id", protectRoute, removeFromChatList);

// Search for other users to add (excluding self and already added users)
router.get("/search", protectRoute, searchUsers);

export default router;
