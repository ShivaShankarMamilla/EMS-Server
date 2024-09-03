import { userSchema,loginSchema,logoutSchema } from "../utils/zodSchemas.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import {Request,Response} from "express";

export const registerController= async(req: Request, res: Response)=> {
    try {
      const userData = userSchema.parse(req.body); // Validating user data using zod
  
      // Check for existing user (optional, consider unique username constraint in the model)
      const existingUser = await User.findOne({ username: userData.username })
      const existingEmail = await User.findOne({email:userData.email})
      const existingPhoneNumber = await User.findOne({phoneNumber:userData.phoneNumber})
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if(existingEmail){
        return res.status(400).json({ message: 'Email already exists' });
      }
      if(existingPhoneNumber){
        return res.status(400).json({ message: 'Mobile Number already exists' });
      }
  
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(userData.password, 10);
  
      // Create new user
      const newUser = new User({ ...userData, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  export const loginController = async (req: Request, res: Response) => {
    const userData = loginSchema.parse(req.body);
    const { username, password } = userData;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Record login time
      const attendance = new Attendance({
        userId: user._id,
        date: new Date(),
        loginTime: new Date(),
      });
      await attendance.save();
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.MY_SECRET!, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const logoutController = async(req:Request,res:Response) => {
    const userData = logoutSchema.parse(req.body);
    const { userId } = userData;
    try {
      const attendance = await Attendance.findOne({
        userId,
        date: { $gte: new Date().setHours(0, 0, 0, 0) }, // Match records from today
      });
  
      if (!attendance) {
        return res.status(400).json({ message: 'No login record found for today' });
      }
  
      // Update the logout time
      attendance.logoutTime = new Date();
      await attendance.save();
  
      res.status(200).json({ message: 'Logout successful, time recorded' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }