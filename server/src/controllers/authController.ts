import { Request, Response } from 'express';
import { authenticateUser, registerUser } from '../lib/accountService';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const user = await registerUser(name, email, password);
    const token = signToken({ userId: user.id });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountNumber: user.accountNumber,
        balanceCents: user.balanceCents
      }
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await authenticateUser(email, password);
    const token = signToken({ userId: user.id });
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountNumber: user.accountNumber,
        balanceCents: user.balanceCents
      }
    });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};