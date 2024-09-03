var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/User.js';
import { Otp } from '../models/OTPSChema.js';
import ResetToken from '../models/ResetToken.js';
import { otpRequestSchema, otpVerifySchema, passwordResetRequestSchema, passwordResetSchema } from '../utils/zodSchemas.js';
import { sendOtpEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { z } from 'zod';
import crypto from "crypto";
import bcrypt from "bcrypt";
export const sendOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = otpRequestSchema.parse(req.body);
        const user = yield User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not registered' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        // Sending OTP via email
        yield sendOtpEmail(email, otp);
        // Check if an OTP record already exists for this user
        let otpRecord = yield Otp.findOne({ user: user._id });
        if (otpRecord) {
            // Update the existing OTP record with the new OTP and expiry time
            otpRecord.otp = otp;
            otpRecord.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        }
        else {
            // Create a new OTP record if none exists
            otpRecord = new Otp({
                user: user._id,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
            });
        }
        // Save the OTP record (either new or updated)
        yield otpRecord.save();
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export const verifyOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the incoming request
        const { _id, otp } = otpVerifySchema.parse(req.body);
        // Find the OTP record for the given user _id
        const otpRecord = yield Otp.findOne({ user: _id });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        // Check if the OTP matches and is still valid
        const isValidOtp = otpRecord.otp === otp && otpRecord.expiresAt > new Date();
        if (!isValidOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        // If OTP is valid, you can now proceed with whatever action is needed (e.g., allowing login)
        // Optionally, you can delete the OTP record after successful verification
        yield Otp.deleteOne({ user: _id });
        res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export const requestPasswordResetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = passwordResetRequestSchema.parse(req.body);
        const user = yield User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not registered' });
        }
        // Generate a reset token and expiry time
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        // Save the reset token
        yield ResetToken.create({
            user: user._id,
            token: resetToken,
            expiresAt: tokenExpiresAt,
        });
        // Send password reset email with the token
        const resetLink = `${process.env.BASE_URL}/api/users/reset-password?token=${resetToken}`;
        yield sendPasswordResetEmail(email, resetLink);
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword } = passwordResetSchema.parse(req.body);
        const { token } = req.query;
        // Find the reset token
        const resetToken = yield ResetToken.findOne({
            token,
            expiresAt: { $gt: new Date() }, // Token must not be expired
        });
        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Find the user and update the password
        const user = yield User.findById(resetToken.user);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        user.password = yield bcrypt.hash(newPassword, 10);
        yield user.save();
        // Remove the reset token
        yield ResetToken.deleteOne({ _id: resetToken._id });
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
