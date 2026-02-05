import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  depositFunds,
  externalTransfer,
  getUserById,
  listTransactions,
  setPin,
  transferFunds,
  withdrawFunds,
  createVirtualCard
} from '../lib/accountService';

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
    balanceCents: user.balanceCents,
    pinSet: Boolean(user.pinHash),
    virtualCard: user.virtualCard ?? null,
    profilePicture: user.profilePicture
  });
};

export const updatePin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { pin } = req.body as { pin: string };
    const user = await setPin(userId, pin);
    res.status(200).json({ pinSet: Boolean(user.pinHash) });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createCard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const card = await createVirtualCard(userId);
    res.status(201).json({ virtualCard: card });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deposit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { amountCents, keyword } = req.body as { amountCents: number; keyword?: string };
    const result = await depositFunds(userId, amountCents, keyword);
    res.status(200).json({
      balanceCents: result.user.balanceCents,
      status: result.status,
      transaction: result.transaction
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const withdraw = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { amountCents, pin, beneficiaryName, beneficiaryEmail, beneficiaryBank, beneficiaryAccount,beneficiaryRoutingNumber, beneficiarySwiftCode, beneficiaryIbanNumber} = req.body as {
      amountCents: number;
      pin: string;
      beneficiaryName: string;
      beneficiaryEmail: string;
      beneficiaryBank: string;
      beneficiaryAccount: string;
      beneficiarySwiftCode?: string;
      beneficiaryIbanNumber?: string;
      beneficiaryRoutingNumber?: string;
    };
    const result = await withdrawFunds(userId, amountCents, pin, {
      name: beneficiaryName,
      email: beneficiaryEmail,
      bank: beneficiaryBank,
      account: beneficiaryAccount,
      routing: beneficiaryRoutingNumber,
      iban: beneficiaryIbanNumber ,
      swift: beneficiarySwiftCode
    });
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
    const { amountCents, toAccountNumber, pin } = req.body as { amountCents: number; toAccountNumber: string; pin: string };
    const result = await transferFunds(userId, toAccountNumber, amountCents, pin);
    res.status(200).json({
      balanceCents: result.fromUser.balanceCents,
      transaction: result.fromTransaction
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const externalTransferController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { amountCents, pin, beneficiaryName, beneficiaryEmail, beneficiaryBank, beneficiaryAccount } = req.body as {
      amountCents: number;
      pin: string;
      beneficiaryName: string;
      beneficiaryEmail: string;
      beneficiaryBank: string;
      beneficiaryAccount: string;
    };
    const result = await externalTransfer(userId, amountCents, pin, {
      name: beneficiaryName,
      email: beneficiaryEmail,
      bank: beneficiaryBank,
      account: beneficiaryAccount,
      routing: '',
      iban: '',
      swift: ''
    });
    res.status(200).json({
      balanceCents: result.user.balanceCents,
      transaction: result.transaction
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