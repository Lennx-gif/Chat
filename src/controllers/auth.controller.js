import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";  
import cloudinary, { uploadImage, deleteImage, extractPublicId } from "../lib/cloudinary.js";



export const signup = async(req,res) => {
    const {email, fullName, password, profilePic} = req.body;
    // Validate the input   
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        // Check if the user already exists
        const user = await User.findOne({ email: normalizedEmail });
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload profile picture if provided.
        // We attempt the upload before creating the user so that a failed upload
        // never results in a saved user with a missing/orphaned image.
        let profilePicture = "";
        if (profilePic) {
            // Defensive: extract and delete any pre-existing image at this URL
            // (shouldn't happen on signup, but guards against edge cases)
            const existingPublicId = extractPublicId(profilePic);
            if (existingPublicId) {
                await deleteImage(existingPublicId);
            }

            // Use the shared uploadImage utility for consistent error handling
            profilePicture = await uploadImage(profilePic);
        }

        // Create a new user only after the upload has succeeded
        const newUser = new User({
            fullName,
            email: normalizedEmail,
            password:hashedPassword,
            profilePicture: profilePicture || undefined,
        });
        
        if (newUser) {
            // Generate a token
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            });

        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = (req,res) => {
    const {email, password} = req.body;
    // Validate the input
    if(!email || !password) {
        return res.status(400).json({message: "Please fill all the fields"});
    }
    const normalizedEmail = email.toLowerCase().trim();
    // Check if the user exists
    User.findOne({email: normalizedEmail})
        .then(async(user) => {
            if(!user) {
                return res.status(400).json({message: "Invalid credentials"});
            }
            // Check if the password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({message: "Invalid credentials"});
            }
            // Generate a token
            generateToken(user._id, res);
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin,
            });

            console.log("User logged in successfully");
        })
        .catch((error) => {
            console.log("Error in login controller",error.message);
            res.status(500).json({message: "Internal server error"});
        });
}

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,    // must match the flags used when the cookie was set
            sameSite: 'none', // required for cross-domain cookie clearing
        });
        res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message: "Internal server error"});  
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // Fetch the current user so we can clean up their old profile picture.
        // We extract the public ID from the stored Cloudinary URL — this is
        // necessary because cloudinary.uploader.destroy requires the public ID,
        // not the full URL.
        const currentUser = await User.findById(userId);
        const oldPublicId = extractPublicId(currentUser?.profilePicture);

        // Delete the old image BEFORE uploading the new one to avoid accumulating
        // orphaned images in Cloudinary when users update their profile picture.
        // A failed deletion is non-fatal: we log it and continue so the user's
        // update is not blocked by a cleanup error.
        if (oldPublicId) {
            await deleteImage(oldPublicId);
        }

        // Use the shared uploadImage utility instead of calling
        // cloudinary.uploader.upload directly. Only update the database if the
        // upload succeeds — this prevents the user record from pointing at a
        // non-existent image if the upload fails mid-way.
        const newImageUrl = await uploadImage(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: newImageUrl },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req,res) => {
    try {
    
        res.status(200).json(req.user);
        console.log("User authenticated successfully");
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
