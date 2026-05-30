import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { uploadImage } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import mongoose from "mongoose";

export const getUsersForSIdebar = async (req, res) => {

    try {
        const loggedInUserId= req.user._id;
        const user = await User.findById(loggedInUserId).populate("chatList", "-password -__v");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Logged in user not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            data:user.chatList
        });
    } catch (error) {
        console.error("Error in getting users for sidebar",error.message);
        res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Verify that the user to chat with is in the current user's chatList
        const currentUser = await User.findById(myId);
        if (!currentUser || !currentUser.chatList.includes(userToChatId)) {
            return res.status(400).json({ error: "Access denied. This user is not in your chat list. Add them to start a conversation." });
        }

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: "Invalid receiver ID" });
        }

        // Verify receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Ensure receiver is in sender's chatList
        const sender = await User.findById(senderId);
        if (!sender || !sender.chatList.includes(receiverId)) {
            return res.status(400).json({ error: "You cannot send messages to someone who is not in your chat list. Add them to your chat list first." });
        }

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            imageUrl = await uploadImage(image, "messages");
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};