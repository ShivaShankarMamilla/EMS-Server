import { model, Schema } from "mongoose";
import { IAttendance } from "../utils/interfaces.js";

const attendanceSchema = new Schema<IAttendance>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date, default: null },
})

const Attendance = model("Attendance",attendanceSchema)
export default Attendance