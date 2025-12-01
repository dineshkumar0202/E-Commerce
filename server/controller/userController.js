import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false,message: "Email already registered"});
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await User.create({name,email, password: hashedPassword});
        // Generate JWT token
        const token = user.generateAuthToken();
        // Store token inside a cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send response
        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false,message: error.message});
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,message: "Please provide email and password"});
        }

        // 2. Find user and include password (because select:false)
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({success: false,message: "User not found"});
        }

        // 3. Compare password
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,message: "Invalid email or password"});
        }

        // 4. Generate token
        const token = user.generateAuthToken();
        // 5. Set token cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 6. Return success
        res.status(200).json({
            success: true, message: "Login successful",token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
};


export { registerUser, userLogin };