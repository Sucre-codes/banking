import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { generateAccountNumber } from '../utils/accountNumber';
import { sendEmail } from '../services/emailService';

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const accountNumber = generateAccountNumber();
  const user = await User.create({
    name,
    email,
    passwordHash,
    accountNumber,
    balanceCents: 0
  });

  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const getUserById = async (userId: string) => {
  return User.findById(userId);
};

export const depositFunds = async (userId: string, amountCents: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    user.balanceCents += amountCents;
    await user.save({ session });

    const transaction = await Transaction.create([
      {
        userId: user._id,
        type: 'deposit',
        amountCents,
        balanceAfterCents: user.balanceCents,
        description: 'Deposit'
      }
    ], { session });

    await session.commitTransaction();

    await sendEmail({
      to: user.email,
      subject: 'Deposit confirmation',
      htmlContent: `<p>Deposit of ${amountCents} cents completed. New balance: ${user.balanceCents} cents.</p>`
    });

    return { user, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const withdrawFunds = async (userId: string, amountCents: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balanceCents < amountCents) {
      throw new Error('Insufficient funds');
    }

    user.balanceCents -= amountCents;
    await user.save({ session });

    const transaction = await Transaction.create([
      {
        userId: user._id,
        type: 'withdrawal',
        amountCents,
        balanceAfterCents: user.balanceCents,
        description: 'Withdrawal'
      }
    ], { session });

    await session.commitTransaction();

    await sendEmail({
      to: user.email,
      subject: 'Withdrawal confirmation',
      htmlContent: `<p>Withdrawal of ${amountCents} cents completed. New balance: ${user.balanceCents} cents.</p>`
    });

    return { user, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const transferFunds = async (fromUserId: string, toAccountNumber: string, amountCents: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromUser = await User.findById(fromUserId).session(session);
    if (!fromUser) {
      throw new Error('User not found');
    }

    const toUser = await User.findOne({ accountNumber: toAccountNumber }).session(session);
    if (!toUser) {
      throw new Error('Recipient account not found');
    }

    if (fromUser.balanceCents < amountCents) {
      throw new Error('Insufficient funds');
    }

    fromUser.balanceCents -= amountCents;
    toUser.balanceCents += amountCents;

    await fromUser.save({ session });
    await toUser.save({ session });

    const [fromTx, toTx] = await Transaction.create([
      {
        userId: fromUser._id,
        type: 'transfer-out',
        amountCents,
        balanceAfterCents: fromUser.balanceCents,
        counterpartyAccount: toUser.accountNumber,
        description: 'Transfer to another account'
      },
      {
        userId: toUser._id,
        type: 'transfer-in',
        amountCents,
        balanceAfterCents: toUser.balanceCents,
        counterpartyAccount: fromUser.accountNumber,
        description: 'Transfer from another account'
      }
    ], { session });

    await session.commitTransaction();

    await Promise.all([
      sendEmail({
        to: fromUser.email,
        subject: 'Transfer sent',
        htmlContent: `<p>Transfer of ${amountCents} cents to ${toUser.accountNumber} completed. New balance: ${fromUser.balanceCents} cents.</p>`
      }),
      sendEmail({
        to: toUser.email,
        subject: 'Transfer received',
        htmlContent: `<p>Transfer of ${amountCents} cents from ${fromUser.accountNumber} received. New balance: ${toUser.balanceCents} cents.</p>`
      })
    ]);

    return { fromUser, toUser, fromTransaction: fromTx, toTransaction: toTx };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const listTransactions = async (userId: string) => {
  return Transaction.find({ userId }).sort({ createdAt: -1 });
};