import { Document,Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    joiningDate: Date;
    address: string;
    skills: string[];
    role: string;
    education: {
      degree: string;
      fieldOfStudy: string;
      institution: string;
      yearOfCompletion: number;
    };
    bloodGroup: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    gender: string;
  }

export interface IAttendance extends Document{
    userId:Schema.Types.ObjectId,
    date:Date,
    loginTime:Date,
    logoutTime:Date | null
}

export interface IOtp extends Document {
    user: Schema.Types.ObjectId;
    otp: number;
    expiresAt: Date;
    createdAt: Date;
  }
