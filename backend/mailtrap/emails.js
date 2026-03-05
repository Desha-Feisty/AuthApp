import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.js";
export const sendVerificationEmail = async (email, verificationToken) => {
    const recepient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken,
            ),
            category: "Email Verification",
        });
        console.log("Email sent successfully!", response);
    } catch (error) {
        console.error(`Error sending verification mail: ${error}`);
        throw new Error(`Error sending verification mail: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Our App",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
            category: "Welcome Email",
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);

        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recepient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                "{resetURL}",
                resetURL,
            ),
            category: "Password Reset",
        });
        console.log("Email sent successfully!", response);
    } catch (error) {
        console.error(`Error sending verification mail: ${error}`);
        throw new Error(`Error sending verification mail: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recepient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Password Reset",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });
        console.log("Email sent successfully!", response);
    } catch (error) {
        console.error(`Error sending verification mail: ${error}`);
        throw new Error(`Error sending verification mail: ${error}`);
    }
};
