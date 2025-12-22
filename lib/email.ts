import nodemailer from "nodemailer";
import { BASE_URL } from "./constants";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const baseUrl = isDevelopment 
    ? "http://localhost:3001" 
    : (process.env.NEXT_PUBLIC_APP_URL || BASE_URL);
  
  const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

