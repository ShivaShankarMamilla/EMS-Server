import { Schema, model } from 'mongoose';

const resetTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ResetToken = model('ResetToken', resetTokenSchema);

export default ResetToken;