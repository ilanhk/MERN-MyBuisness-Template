import { Schema, Document, Model, model, models } from 'mongoose';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  isEmployee: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  inEmailList: boolean;
  twoFaSecret: string | null;
  refreshToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: number | null;
}

const userSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  isEmployee: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  inEmailList: { type: Boolean, default: false },
  twoFaSecret: { type: String, default: null },
  refreshToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Number, default: null },
}, { timestamps: true });

export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument> | undefined) ?? model<UserDocument>('User', userSchema);
