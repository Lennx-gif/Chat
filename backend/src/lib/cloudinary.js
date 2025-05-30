import {v2 as cloudinary} from 'cloudinary';

import {config} from "dotenv";

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true   
});
export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "your_folder_name", // Optional: specify a folder in your Cloudinary account
        });
        return result.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
};

export default cloudinary;
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted successfully");
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new Error("Image deletion failed");
    }
};