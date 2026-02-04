import {type FormEvent, useEffect, useState } from 'react';
import { deposit, fetchProfile, transfer, withdraw } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const formatCents = (value: number) => {
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const DashboardPage = () => {
  const { user, token, updateUser } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAccount, setTransferAccount] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchProfile(token)
      .then((profile) => updateUser(profile))
      .catch(() => null);
  }, [token, updateUser]);

  if (!user || !token) {
    return (
      <section className="card">
        <h2>Welcome to NovaBank</h2>
        <p>Please register or sign in to access your simulated account.</p>
      </section>
    );
  }

  const handleDeposit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    try {
      const amountCents = Math.round(Number(depositAmount) * 100);
      const balanceCents = await deposit(token, amountCents);
      updateUser({ ...user, balanceCents });
      setStatus('Deposit completed.');
      setDepositAmount('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleWithdraw = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    try {
      const amountCents = Math.round(Number(withdrawAmount) * 100);
      const balanceCents = await withdraw(token, amountCents);
      updateUser({ ...user, balanceCents });
      setStatus('Withdrawal completed.');
      setWithdrawAmount('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleTransfer = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    try {
      const amountCents = Math.round(Number(transferAmount) * 100);
      const balanceCents = await transfer(token, { amountCents, toAccountNumber: transferAccount });
      updateUser({ ...user, balanceCents });
      setStatus('Transfer sent.');
      setTransferAmount('');
      setTransferAccount('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="dashboard">
      <div className="card">
        <h2>Hello, {user.name}</h2>
        <div className="balance">
          <span>Current balance</span>
          <strong>{formatCents(user.balanceCents)}</strong>
        </div>
        <div className="account-meta">
          <div>
            <span>Account number</span>
            <strong>{user.accountNumber}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </div>
        {status && <div className="status">{status}</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <div className="grid">
        <form className="card" onSubmit={handleDeposit}>
          <h3>Deposit</h3>
          <label>
            Amount (USD)
            <input
              type="number"
              min="0"
              step="0.01"
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              required
            />
          </label>
          <button type="submit">Deposit</button>
        </form>

        <form className="card" onSubmit={handleWithdraw}>
          <h3>Withdraw</h3>
          <label>
            Amount (USD)
            <input
              type="number"
              min="0"
              step="0.01"
              value={withdrawAmount}
              onChange={(event) => setWithdrawAmount(event.target.value)}
              required
            />
          </label>
          <button type="submit">Withdraw</button>
        </form>

        <form className="card" onSubmit={handleTransfer}>
          <h3>Transfer</h3>
          <label>
            Recipient account
            <input
              type="text"
              value={transferAccount}
              onChange={(event) => setTransferAccount(event.target.value)}
              required
            />
          </label>
          <label>
            Amount (USD)
            <input
              type="number"
              min="0"
              step="0.01"
              value={transferAmount}
              onChange={(event) => setTransferAmount(event.target.value)}
              required
            />
          </label>
          <button type="submit">Send transfer</button>
        </form>
      </div>
    </section>
  );
};

export default DashboardPage;