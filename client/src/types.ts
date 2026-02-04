export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accountNumber: string;
  balanceCents: number;
}

export interface Transaction {
  _id: string;
  type: string;
  amountCents: number;
  balanceAfterCents: number;
  counterpartyAccount?: string;
  description?: string;
  createdAt: string;
}