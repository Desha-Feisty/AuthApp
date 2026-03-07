import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    }),
);
app.use("/api/auth", authRoutes);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
}

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
