import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";  
import cloudinary from "../lib/cloudinary.js";
import { uploadImage } from "../lib/cloudinary.js";



export const signup = async(req,res) => {
    const {email, fullName, password} = req.body;
    // Validate the input   
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        // Check if the user already exists
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
            profilePicture: req.file ? req.file.path : "",
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
                isAdmin: newUser.isAdmin,
            });

        } else {
            res.status(400).json({message: "Invalid user data"});
        }
        console.log("User created successfully");
        // Send a response
        
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
    // Check if the user exists
    User.findOne({email})
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
        res.cookie("jwt", "", {maxage:0});
        res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message: "Internal server error"});  
    }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // or however you get user id from protectRoute
    const { profilePic } = req.body; // expect base64 or image url

    // upload only if a new image was provided
    let secureUrl = profilePic;
    if (profilePic && profilePic.startsWith("data:")) {
      secureUrl = await uploadImage(profilePic); // uploadImage returns secure_url
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = secureUrl || user.profilePic;
    

    // return updated user (omit sensitive fields)
    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt
    };

    return res.json(safeUser);
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).json({ message: "Error updating profile" });
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