import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: 7,
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: "user"
    }
});

// ⭐ Generate JWT Token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export default mongoose.model("User", userSchema);
