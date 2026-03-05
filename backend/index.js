import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);

async function run() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log("running on ", PORT);
        });
    } catch (error) {
        console.log(error);
    }
}

run();
