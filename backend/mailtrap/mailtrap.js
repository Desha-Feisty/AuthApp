import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
import path from "path";

// load environment variables from project root so scripts run from subfolders still get values
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
if (!TOKEN) {
    console.warn("MAILTRAP_TOKEN is not defined - email sending will fail");
}

export const mailtrapClient = new MailtrapClient({
    token: TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.co",
    name: "Mailtrap Test",
};
