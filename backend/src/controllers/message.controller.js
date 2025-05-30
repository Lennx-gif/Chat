import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSIdebar = async (req, res) => {

    try {
        const loggedInUserId= req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password -__v");
        res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            data:filteredUser
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
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        }).populate("sender", "name profilePic").populate("receiver", "name profilePic")
        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: message
        });
    } catch (error) {
        console.error("Error in getting messages", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    //try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const newMessage = await Message.create({
            sender: myId,
            receiver: userToChatId,
            message
        });

        await newMessage.populate("sender", "name profilePic").populate("receiver", "name profilePic");

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    //} catch (error) {
        console.error("Error in sending message", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    //}
    try {
        const {text, image} = req.body;
        const { id:userToChatId } = req.params;
        const myId = req.user._id;
        let imageUrl;
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "messages",
                resource_type: "auto"
            });
            imageUrl = result.secure_url;
        };

        const newMessage = await Message.create({
            sender: myId,
            receiver: userToChatId,
            message: text,
            image: imageUrl
        });

        await newMessage.save();

        // realtime functionality

        res.status(201).json(newMessage);
        // socket.emit("message received", newMessage);


    } catch (error) {
        console.error("Error in sending message", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};