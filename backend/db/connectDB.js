import { connect } from "mongoose";

export default async function connectDB() {
    try {
        await connect(process.env.MONGO_URI);
        console.log("db connected");
    } catch (error) {
        console.log(error);
    }
}
