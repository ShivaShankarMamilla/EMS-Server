import { model, Schema } from "mongoose";
const attendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    loginTime: { type: Date, required: true },
    logoutTime: Date,
});
const Attendance = model("Attendance", attendanceSchema);
export default Attendance;
