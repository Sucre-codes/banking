import mongoose, { Schema } from 'mongoose';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer-in' | 'transfer-out';

export interface TransactionDocument {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amountCents: number;
  balanceAfterCents: number;
  counterpartyAccount?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    amountCents: { type: Number, required: true, min: 1 },
    balanceAfterCents: { type: Number, required: true, min: 0 },
    counterpartyAccount: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema);