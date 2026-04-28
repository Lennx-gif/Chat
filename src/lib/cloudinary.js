import {v2 as cloudinary} from 'cloudinary';

import {config} from "dotenv";

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
    secure: true   
});

/**
 * Uploads an image to Cloudinary and returns its secure URL.
 * Used consistently across all controllers instead of calling
 * cloudinary.uploader.upload directly.
 */
export const uploadImage = async (filePath, folder = "profile_pictures") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
        });
        return result.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
};

/**
 * Extracts the Cloudinary public ID from a full Cloudinary URL so it can be
 * passed to cloudinary.uploader.destroy for cleanup.
 *
 * Expected URL format:
 *   https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{ext}
 *
 * The public ID includes any folder prefix, e.g. "profile_pictures/abc123".
 * Returns null if the URL is not a recognised Cloudinary URL.
 */
export const extractPublicId = (url) => {
    if (!url || !url.includes("res.cloudinary.com")) return null;
    try {
        // Split on "/upload/" and take everything after it
        const afterUpload = url.split("/upload/")[1];
        if (!afterUpload) return null;
        // Strip the optional version segment (v<digits>/)
        const withoutVersion = afterUpload.replace(/^v\d+\//, "");
        // Strip the file extension
        const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
        return publicId || null;
    } catch {
        return null;
    }
};

export default cloudinary;

/**
 * Deletes an image from Cloudinary by its public ID.
 * Errors are logged but NOT re-thrown — a failed deletion means wasted
 * storage quota, but it should never block the main operation.
 */
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Image deleted successfully (publicId: ${publicId})`);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Do not re-throw: old image is just wasted storage, not a fatal error
    }
};
