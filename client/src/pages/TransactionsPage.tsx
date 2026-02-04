import { useEffect, useState } from 'react';
import { fetchTransactions } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Transaction } from '../types';

const formatCents = (value: number) => {
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const TransactionsPage = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchTransactions(token)
      .then(setTransactions)
      .catch(() => setError('Unable to load transactions.'));
  }, [token]);

  if (!token) {
    return (
      <section className="card">
        <h2>Transactions</h2>
        <p>Please sign in to view your history.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Transaction history</h2>
      <p>All values are simulated and stored in cents.</p>
      {error && <div className="error">{error}</div>}
      <div className="table">
        <div className="table-row header">
          <span>Date</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Balance after</span>
          <span>Counterparty</span>
        </div>
        {transactions.map((transaction) => (
          <div key={transaction._id} className="table-row">
            <span>{new Date(transaction.createdAt).toLocaleString()}</span>
            <span>{transaction.type}</span>
            <span>{formatCents(transaction.amountCents)}</span>
            <span>{formatCents(transaction.balanceAfterCents)}</span>
            <span>{transaction.counterpartyAccount ?? '-'}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransactionsPage;
