import mongoose, { Schema } from 'mongoose';

export interface UserDocument {
  email: string;
  name: string;
  passwordHash: string;
  accountNumber: string;
  balanceCents: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    balanceCents: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', userSchema);
