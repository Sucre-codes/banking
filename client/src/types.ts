import type { Key } from "react";

export interface VirtualCard {
  cardNumber: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface AuthUser {
  profilePicture: string | undefined;
  id: string;
  email: string;
  name: string;
  accountNumber: string;
  balanceCents: number;
  pinSet: boolean;
  virtualCard: VirtualCard | null;
}

export interface Transaction {
  [x: string]: Key | null | undefined;
  _id: string;
  type: string;
  amountCents: number;
  balanceAfterCents: number;
  status: string;
  counterpartyAccount?: string;
  beneficiaryName?: string;
  beneficiaryEmail?: string;
  beneficiaryBank?: string;
  beneficiaryAccount?: string;
  description?: string;
  createdAt: string;
}