import { Schema,model} from "mongoose";
import { IUser } from "../utils/interfaces.js";


const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true   
   },
    joiningDate: { type: Date, default: Date.now },
    address: { type: String },
    skills: [{ type: String }],
    role: { type: String }, 
    education: {
      degree: String,
      fieldOfStudy: String,
      institution: String,
      yearOfCompletion: Number,
    },
    bloodGroup: String,
    dateOfBirth: Date,
    phoneNumber: {type:String,required:true,unique:true},
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'others'], required: true },
  });

const User = model<IUser>('User',userSchema)
export default User