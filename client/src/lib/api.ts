import type{ AuthUser, Transaction, VirtualCard } from '../types';

const API_URL = import.meta.env.VITE_API_URL as string;

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const registerUser = async (payload: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }
  return res.json() as Promise<AuthResponse>;
};

export const loginUser = async (payload: { identifier: string; password: string }): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }
  return res.json() as Promise<AuthResponse>;
};

export const fetchProfile = async (token: string): Promise<AuthUser> => {
  const res = await fetch(`${API_URL}/api/account/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to load profile');
  }
  return res.json() as Promise<AuthUser>;
};

export const setPin = async (token: string, pin: string): Promise<{ pinSet: boolean }> => {
  const res = await fetch(`${API_URL}/api/account/pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pin })
  });
  if (!res.ok) {
    throw new Error('PIN update failed');
  }
  return res.json() as Promise<{ pinSet: boolean }>;
};

export const createVirtualCard = async (token: string): Promise<VirtualCard> => {
  const res = await fetch(`${API_URL}/api/account/virtual-card`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Virtual card creation failed');
  }
  const data = await res.json() as { virtualCard: VirtualCard };
  return data.virtualCard;
};

export const deposit = async (token: string, payload: { amountCents: number; keyword?: string }): Promise<{ balanceCents: number; status: string }> => {
  const res = await fetch(`${API_URL}/api/account/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Deposit failed');
  }
  return res.json() as Promise<{ balanceCents: number; status: string }>;
};

export const withdraw = async (token: string, payload: {
  amountCents: number;
  pin: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  beneficiaryRoutingNumber?:string;
  beneficiaryIbanNumber?:string;
  beneficiarySwiftCode?:string;
}): Promise<number> => {
  const res = await fetch(`${API_URL}/api/account/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Withdrawal failed');
  }
  const data = await res.json() as { balanceCents: number };
  return data.balanceCents;
};

export const transfer = async (token: string, payload: { amountCents: number; toAccountNumber: string; pin: string }): Promise<number> => {
  const res = await fetch(`${API_URL}/api/account/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Transfer failed');
  }
  const data = await res.json() as { balanceCents: number };
  return data.balanceCents;
};

export const externalTransfer = async (token: string, payload: {
  amountCents: number;
  pin: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  beneficiaryRoutingNumber?:string;
  beneficiaryIbanNumber?:string;
  beneficiarySwiftCode?:string;
}): Promise<number> => {
  const res = await fetch(`${API_URL}/api/account/external-transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('External transfer failed');
  }
  const data = await res.json() as { balanceCents: number };
  return data.balanceCents;
};

export const fetchTransactions = async (token: string): Promise<Transaction[]> => {
  const res = await fetch(`${API_URL}/api/account/transactions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to load transactions');
  }
  const data = await res.json() as { transactions: Transaction[] };
  return data.transactions;
};