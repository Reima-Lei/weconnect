import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
    if (!sender?.email || !sender?.name) {
        throw new Error("Email sender configuration missing (EMAIL_FROM / EMAIL_FROM_NAME).");
    }
    if (!email) throw new Error("Recipient email is required.");
    if (!clientURL) throw new Error("Client URL is required.");

    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to WeConnect!",
        html: createWelcomeEmailTemplate(name, clientURL),
        text: `Welcome to WeConnect, ${name}! Get started: ${clientURL}`,
    });

    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome email sent successfully", data);
};