import mongoose, { Schema } from 'mongoose';


export type TransactionType =
  | 'deposit'
  | 'deposit-pending'
  | 'withdrawal'
  | 'transfer-in'
  | 'transfer-out'
  | 'external-transfer';

export interface TransactionDocument {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amountCents: number;
  balanceAfterCents: number;
  status: 'pending' | 'completed';
  counterpartyAccount?: string;
  beneficiaryName?: string;
  beneficiaryEmail?: string;
  beneficiaryBank?: string;
  beneficiaryAccount?: string;
  beneficiaryRoutingNumber?:string;
  beneficiarySwiftCode?:string;
  beneficiaryIbanNumber?:string;
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
    status: { type: String, required: true },
    counterpartyAccount: { type: String },
    beneficiaryName: { type: String },
    beneficiaryEmail: { type: String },
    beneficiaryBank: { type: String },
    beneficiaryAccount: { type: String },
    beneficiaryRoutingNumber:{type: String},
    beneficiarySwiftCode:{type:String},
    beneficiaryIbanNumber:{type:String},
    description: { type: String }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema);