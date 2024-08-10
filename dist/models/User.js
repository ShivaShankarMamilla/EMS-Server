import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    joiningDate: {
        type: Date,
        required: true,
    },
    address: {
        type: String, required: true
    },
    skills: {
        type: [String],
        required: true
    },
    role: {
        type: String, required: true
    },
});
const User = model('User', UserSchema);
export default User;
