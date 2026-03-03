import User from "../models/user.model.js";
import { generateTokenAndSendCookie } from "../utils/generateTokenAndSendCookie.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
export const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required!");
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists!" });
        }
        const verifactionToken = generateVerificationToken();
        const user = await User.create({
            email,
            name,
            password,
            verifactionToken,
            verificationTokenExpiresAt: new Date(
                Date.now() + 24 * 60 * 60 * 1000,
            ),
        });
        generateTokenAndSendCookie(user, res);
        await sendVerificationEmail(user.email, verifactionToken);
        return res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verifactionToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }
        user.isVerified = true;
        user.verifactionToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        
        // send welcome email but don't block the response if it fails
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (mailErr) {
            console.error("Failed to send welcome email:", mailErr.message);
            // you could choose to record this in a log or notify the team
        }

        res.json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const login = async (req, res) => {
    res.send("signup route");
};
export const logout = async (req, res) => {
    res.send("signup route");
};
