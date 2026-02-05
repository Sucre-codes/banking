import mongoose, { Schema } from 'mongoose';

interface VirtualCard {
  cardNumber: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface UserDocument {
  email: string;
  name: string;
  profilePicture?:  String ;
  passwordHash: string;
  pinHash?: string;
  accountNumber: string;
  balanceCents: number;
  virtualCard?: VirtualCard;
  createdAt: Date;
  updatedAt: Date;
}

const virtualCardSchema = new Schema<VirtualCard>(
  {
    cardNumber: { type: String, required: true },
    last4: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    cvv: { type: String, required: true }
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    pinHash: { type: String },
    accountNumber: { type: String, required: true, unique: true },
    balanceCents: { type: Number, required: true, min: 0 },
    virtualCard: { type: virtualCardSchema },
    profilePicture: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', userSchema);