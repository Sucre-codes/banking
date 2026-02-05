import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProfile, fetchTransactions } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { Transaction } from '../types';

const formatCents = (value: number) => {
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const DashboardPage = () => {
  const { user, token, updateUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    Promise.all([
      fetchProfile(token).then((profile) => updateUser(profile)),
      fetchTransactions(token).then((txns) => setTransactions(txns.slice(0, 5)))
    ])
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [token, updateUser]);

  if (!user || !token) {
    return null;
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'deposit-pending':
        return '💰';
      case 'withdrawal':
        return '💸';
      case 'transfer-in':
        return '📥';
      case 'transfer-out':
        return '📤';
      case 'external-transfer':
        return '🌐';
      default:
        return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    if (type.includes('deposit') || type === 'transfer-in') {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-bonavy-700">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-slate-600">Here's your account overview</p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bonavy-700 via-bonavy-700 to-boared-700 p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-white/70">Available Balance</p>
          <p className="mt-2 text-5xl font-bold">{formatCents(user.balanceCents)}</p>
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-white/20 px-3 py-1">Account: {user.accountNumber}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/deposit"
            className="group card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                💰
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-boared-600 transition">Deposit</p>
                <p className="text-xs text-slate-500">Add funds</p>
              </div>
            </div>
          </Link>

          <Link
            to="/withdraw"
            className="group card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                💸
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-boared-600 transition">Withdraw</p>
                <p className="text-xs text-slate-500">Send to bank</p>
              </div>
            </div>
          </Link>

          <Link
            to="/transfer"
            className="group card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🔄
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-boared-600 transition">Transfer</p>
                <p className="text-xs text-slate-500">Send money</p>
              </div>
            </div>
          </Link>

          <Link
            to="/transactions"
            className="group card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                📝
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-boared-600 transition">Activities</p>
                <p className="text-xs text-slate-500">View all</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Virtual Card - Only show if user has one */}
      {user.virtualCard && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Virtual Card</h2>
          <div className="relative h-52 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">
            {/* Card chip */}
            <div className="mb-8 h-10 w-14 rounded bg-gradient-to-br from-yellow-200 to-yellow-400" />
            
            {/* Card number */}
            <div className="mb-6 font-mono text-xl tracking-widest text-white">
              •••• •••• •••• {user.virtualCard.last4}
            </div>
            
            {/* Card details */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">Card Holder</p>
                <p className="font-semibold text-white">{user.name.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Expires</p>
                <p className="font-semibold text-white">
                  {user.virtualCard.expiryMonth}/{user.virtualCard.expiryYear}
                </p>
              </div>
            </div>

            {/* Card brand logo (placeholder) */}
            <div className="absolute right-6 top-6 text-3xl">💳</div>
          </div>
        </div>
      )}

      {/* PIN Warning */}
      {!user.pinSet && (
        <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900">Security PIN Required</p>
              <p className="mt-1 text-sm text-amber-700">
                Set up your 4-digit PIN in Settings to enable withdrawals and transfers.
              </p>
              <Link
                to="/settings"
                className="mt-2 inline-block text-sm font-semibold text-amber-900 underline hover:text-amber-700"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
          <Link to="/transactions" className="text-sm font-semibold text-boared-600 hover:text-boared-700">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="card">
            <p className="text-center text-sm text-slate-500">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="card text-center">
            <div className="text-5xl">📭</div>
            <p className="mt-4 font-semibold text-slate-900">No transactions yet</p>
            <p className="mt-1 text-sm text-slate-500">Your recent activities will appear here</p>
          </div>
        ) : (
          <div className="card divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                    {getTransactionIcon(txn.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {txn.type === 'deposit' || txn.type === 'deposit-pending'
                        ? 'Deposit'
                        : txn.type === 'withdrawal'
                        ? 'Withdrawal'
                        : txn.type === 'transfer-in'
                        ? 'Transfer Received'
                        : txn.type === 'transfer-out'
                        ? 'Transfer Sent'
                        : 'External Transfer'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(txn.createdAt)} • {txn.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getTransactionColor(txn.type)}`}>
                    {txn.type.includes('deposit') || txn.type === 'transfer-in' ? '+' : '-'}
                    {formatCents(txn.amountCents)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Balance: {formatCents(txn.balanceAfterCents)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
