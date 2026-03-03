import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: [true, "Email already exists"],
        },
        password: { type: String, required: true },
        name: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now },
        isVerified: { type: Boolean, default: false },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verifactionToken: String,
        verificationTokenExpiresAt: Date,
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

const User = model("User", userSchema);
export default User;
