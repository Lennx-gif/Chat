import User from "../models/user.model.js";
import mongoose from "mongoose";

// Add a user to the logged-in user's dedicated chat list
export const addToChatList = async (req, res) => {
    try {
        const { userId: targetUserId } = req.body;
        const myId = req.user._id;

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: "User ID is required to add to chat list" });
        }

        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (myId.toString() === targetUserId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot add yourself to your chat list" });
        }

        // Verify target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User to add not found" });
        }

        const currentUser = await User.findById(myId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Logged in user not found" });
        }

        // Check if already in the chat list
        if (currentUser.chatList.includes(targetUserId)) {
            return res.status(400).json({ success: false, message: "User is already in your chat list" });
        }

        // Add to chat list
        currentUser.chatList.push(targetUserId);
        await currentUser.save();

        res.status(200).json({
            success: true,
            message: "User added to chat list successfully",
            data: {
                _id: targetUser._id,
                fullName: targetUser.fullName,
                email: targetUser.email,
                profilePicture: targetUser.profilePicture,
            }
        });
    } catch (error) {
        console.error("Error in addToChatList:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Remove a user from the logged-in user's dedicated chat list
export const removeFromChatList = async (req, res) => {
    try {
        const { id: targetUserId } = req.params;
        const myId = req.user._id;

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: "User ID parameter is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const currentUser = await User.findById(myId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Logged in user not found" });
        }

        // Check if not in the chat list
        if (!currentUser.chatList.includes(targetUserId)) {
            return res.status(400).json({ success: false, message: "User is not in your chat list" });
        }

        // Remove from chat list
        currentUser.chatList = currentUser.chatList.filter(id => id.toString() !== targetUserId.toString());
        await currentUser.save();

        res.status(200).json({
            success: true,
            message: "User removed from chat list successfully"
        });
    } catch (error) {
        console.error("Error in removeFromChatList:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get the user's dedicated chat list
export const getChatList = async (req, res) => {
    try {
        const myId = req.user._id;
        const user = await User.findById(myId).populate("chatList", "-password -__v");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Chat list fetched successfully",
            data: user.chatList
        });
    } catch (error) {
        console.error("Error in getChatList:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Search users on the platform to add to the chat list (excluding self and already added users)
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const myId = req.user._id;

        // Fetch current user's chatList to exclude them from results
        const currentUser = await User.findById(myId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Logged in user not found" });
        }

        const excludedIds = [myId, ...currentUser.chatList];

        let searchCriteria = {
            _id: { $nin: excludedIds }
        };

        if (query) {
            const regex = new RegExp(query, "i");
            searchCriteria.$or = [
                { fullName: regex },
                { email: regex }
            ];
        }

        const users = await User.find(searchCriteria).select("-password -__v").limit(20);

        res.status(200).json({
            success: true,
            message: "Search results fetched successfully",
            data: users
        });
    } catch (error) {
        console.error("Error in searchUsers:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
