var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userSchema, loginSchema, logoutSchema } from "../utils/zodSchemas.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { z } from "zod";
export const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = userSchema.parse(req.body); // Validating user data using zod
        // Check for existing user (optional, consider unique username constraint in the model)
        const existingUser = yield User.findOne({ username: userData.username });
        const existingEmail = yield User.findOne({ email: userData.email });
        const existingPhoneNumber = yield User.findOne({ phoneNumber: userData.phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (existingPhoneNumber) {
            return res.status(400).json({ message: 'Mobile Number already exists' });
        }
        // Hash password before saving
        const hashedPassword = yield bcrypt.hash(userData.password, 10);
        // Create new user
        const newUser = new User(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        yield newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = loginSchema.parse(req.body);
    const { username, password } = userData;
    try {
        const user = yield User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        // Record login time
        const attendance = new Attendance({
            userId: user._id,
            date: new Date(),
            loginTime: new Date(),
        });
        yield attendance.save();
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.MY_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = logoutSchema.parse(req.body);
    const { userId } = userData;
    try {
        const attendance = yield Attendance.findOne({
            userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Match records from today
        });
        if (!attendance) {
            return res.status(400).json({ message: 'No login record found for today' });
        }
        // Update the logout time
        attendance.logoutTime = new Date();
        yield attendance.save();
        res.status(200).json({ message: 'Logout successful, time recorded' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
