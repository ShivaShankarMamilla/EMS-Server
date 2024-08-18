import dotenv from "dotenv"

// src/utils/emailService.ts

import nodemailer from 'nodemailer';
dotenv.config()
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Example: using Gmail as the email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
  // secure: true,
  // port: 465,
});

console.log(process.env.EMAIL_USER,"EMAIL")

export const sendOtpEmail = async (to: string, otp: number) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to, // List of recipients
        subject: 'Your OTP Code for Mploy',
        text: `Your OTP code is ${otp}`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`OTP ${otp} sent to ${to}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to send OTP email: ${error.message}`);
      } else {
        console.error('Failed to send OTP email due to an unknown error');
      }
      throw new Error('Failed to send OTP email');
    }
  };
