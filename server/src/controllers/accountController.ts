import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { depositFunds, getUserById, listTransactions, transferFunds, withdrawFunds } from '../lib/accountService.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId as string;
  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    accountNumber: user.accountNumber,
    balanceCents: user.balanceCents
  });
};

export const deposit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { amountCents } = req.body as { amountCents: number };
    const result = await depositFunds(userId, amountCents);
    res.status(200).json({
      balanceCents: result.user.balanceCents,
      transaction: result.transaction
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const withdraw = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { amountCents } = req.body as { amountCents: number };
    const result = await withdrawFunds(userId, amountCents);
    res.status(200).json({
      balanceCents: result.user.balanceCents,
      transaction: result.transaction
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const transfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { amountCents, toAccountNumber } = req.body as { amountCents: number; toAccountNumber: string };
    const result = await transferFunds(userId, toAccountNumber, amountCents);
    res.status(200).json({
      balanceCents: result.fromUser.balanceCents,
      transaction: result.fromTransaction
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const transactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId as string;
  const data = await listTransactions(userId);
  res.status(200).json({ transactions: data });
};
