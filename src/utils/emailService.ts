import dotenv from "dotenv"
import nodemailer from 'nodemailer';
dotenv.config()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
  // secure: true,
  // port: 465,
});

console.log(process.env.EMAIL_USER,"EMAIL")

export const sendOtpEmail = async (to: string, otp: number) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: to,
        subject: 'Your OTP Code for Mploy',
        html: `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Dynamic Email</title>
  </head>
  <body>
      <h1>Hello ${to}!</h1>
      <p>Your email is: ${to}</p>
      <p>Your OTP for MPloy is ${otp}</p>
  </body>
  </html>
`,
        // text: `Your OTP code is ${otp}`,
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

  export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Password reset link sent to ${to}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to send password reset email: ${error.message}`);
      } else {
        console.error('Failed to send password reset email due to an unknown error');
      }
      throw new Error('Failed to send password reset email');
    }
  };
