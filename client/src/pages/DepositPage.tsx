import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deposit } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const formatCents = (value: number) => {
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const DepositPage = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const amountCents = Math.round(Number(amount) * 100);
      const response = await deposit(token, { 
        amountCents, 
        keyword: remark || undefined 
      });

      updateUser({ ...user, balanceCents: response.balanceCents });
      setSuccess(true);
      setAmount('');
      setRemark('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-bonavy-700">Deposit Funds</h1>
        <p className="mt-2 text-slate-600">Add money to your account</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-xl border-l-4 border-green-500 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">Deposit Successful!</p>
              <p className="mt-1 text-sm text-green-700">
                Your funds have been added. Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-semibold text-red-900">Deposit Failed</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deposit Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Amount (USD)</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input pl-8 text-lg font-semibold"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Minimum deposit: $0.01</p>
            </div>

            <div>
              <label className="label">Remark (Optional)</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="input mt-2"
                placeholder="e.g., Monthly savings"
                maxLength={50}
                disabled={loading}
              />
              <p className="mt-2 text-xs text-slate-500">Add a note for your reference</p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !amount}
            >
              {loading ? 'Processing...' : 'Deposit Now'}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="card bg-gradient-to-br from-bonavy-700 to-boared-700 text-white">
            <p className="text-sm font-medium text-white/70">Current Balance</p>
            <p className="mt-2 text-3xl font-bold">{formatCents(user.balanceCents)}</p>
            {amount && Number(amount) > 0 && (
              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-sm text-white/70">New Balance (after deposit)</p>
                <p className="mt-1 text-2xl font-bold">
                  {formatCents(user.balanceCents + Math.round(Number(amount) * 100))}
                </p>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="card">
            <h3 className="font-semibold text-slate-900">How it works</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-boared-100 text-xs font-bold text-boared-600">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Enter the amount you want to deposit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-boared-100 text-xs font-bold text-boared-600">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Add an optional remark for tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-boared-100 text-xs font-bold text-boared-600">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Funds are instantly added to your account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Secure Transaction</p>
                <p className="mt-1 text-xs text-slate-600">
                  All deposits are encrypted and processed securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
