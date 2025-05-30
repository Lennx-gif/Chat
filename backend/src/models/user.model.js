import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePicture: {
        type: String,
        default: "https://www.gravatar.com/avatar/?d=mp",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    }, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;