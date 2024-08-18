// src/controllers/authController.ts

import User from '../models/User.js';
import { Otp } from '../models/OTPSChema.js';
import { otpRequestSchema } from '../utils/zodSchemas.js';
import { sendOtpEmail } from '../utils/emailService.js';
import { Request, Response } from 'express';
import { z } from 'zod';

export const sendOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = otpRequestSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email not registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Send OTP via email
    await sendOtpEmail(email, otp);

    // Save the OTP and expiry time in the OTP collection
    const otpRecord = new Otp({
      user: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    });
    await otpRecord.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
