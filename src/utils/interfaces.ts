import { Document,Schema } from "mongoose";

export interface IUser extends Document{
    username:string;
    password:string;
    joiningDate:Date;
    address:string;
    skills:string[];
    role:string;
}

export interface IAttendance extends Document{
    userId:Schema.Types.ObjectId,
    date:Date,
    loginTime:Date,
    logoutTime:Date | null
}
