import User from "../models/user.model.js";

export const checkAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: { ...user._doc, password: undefined },
        });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
