import type{ AuthUser, Transaction } from '../types';

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

export const loginUser = async (payload: { email: string; password: string }): Promise<AuthResponse> => {
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

export const deposit = async (token: string, amountCents: number): Promise<number> => {
  const res = await fetch(`${API_URL}/api/account/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amountCents })
  });
  if (!res.ok) {
    throw new Error('Deposit failed');
  }
  const data = await res.json() as { balanceCents: number };
  return data.balanceCents;
};

export const withdraw = async (token: string, amountCents: number): Promise<number> => {
  const res = await fetch(`${API_URL}/api/account/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amountCents })
  });
  if (!res.ok) {
    throw new Error('Withdrawal failed');
  }
  const data = await res.json() as { balanceCents: number };
  return data.balanceCents;
};

export const transfer = async (token: string, payload: { amountCents: number; toAccountNumber: string }): Promise<number> => {
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