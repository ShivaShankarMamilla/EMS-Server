import { model, Schema } from "mongoose";
import { IOtp } from "../utils/interfaces.js";
 const otpSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  });

export const Otp = model<IOtp>('Otp', otpSchema);