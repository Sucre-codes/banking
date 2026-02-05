import { useEffect, useState, } from 'react';
import { fetchTransactions } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { type Transaction } from '../types';
import { useNavigate } from 'react-router-dom';


const formatCents = (value: number) => {
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const TransactionsPage = () => {
  const navigate = useNavigate()
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
         <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-xl font-semibold text-bonavy-700">Transactions</h2>
        <p className="text-sm text-slate-500">Please sign in to view your history.</p>
      </section>
    );
  }

  return (
    <section className="card">
       <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>
      <h2 className="text-xl font-semibold text-bonavy-700">Transaction history</h2>
      <p className="text-sm text-slate-500">Here is a sum up of all your transactions.</p>
      {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="mt-6 grid gap-3">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-bonavy-700">{transaction.type}</p>
                <p className="text-xs text-slate-500">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-bonavy-700">{formatCents(transaction.amountCents)}</p>
                <p className="text-xs text-slate-500">Balance: {formatCents(transaction.balanceAfterCents)}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <span>Status: {transaction.status}</span>
              <span>Counterparty: {transaction.counterpartyAccount ?? transaction.beneficiaryAccount ?? '-'}</span>
              <span>Beneficiary: {transaction.beneficiaryName ?? '-'}</span>
              <span>Email: {transaction.beneficiaryEmail ?? '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransactionsPage;