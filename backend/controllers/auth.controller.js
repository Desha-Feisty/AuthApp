import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSendCookie } from "../utils/generateTokenAndSendCookie.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendResetPasswordEmail,
    sendResetSuccessEmail,
} from "../mailtrap/emails.js";
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
        generateTokenAndSendCookie(user._id, res);
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

        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (error) {
            console.error("Failed to send welcome email:", error.message);
        }

        res.json({
            success: true,
            message: "Email verified successfully",
            user: { ...user._doc, password: undefined },
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
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ success: false, message: "Incorrect Credentials" });
        }
        generateTokenAndSendCookie(user._id, res);
        user.lastLogin = new Date();
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
export const logout = async (req, res) => {
    res.clearCookie("token")
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = new Date(
            Date.now() + 1 * 60 * 60 * 1000, // 1 hour
        );
        await user.save();
        const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
        await sendResetPasswordEmail(user.email, resetPasswordURL);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token: resetPasswordToken } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid or expired token" });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
