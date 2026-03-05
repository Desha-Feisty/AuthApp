import jwt from "jsonwebtoken";

export const generateTokenAndSendCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };
    res.cookie("token", token, options);
    return token;
};
