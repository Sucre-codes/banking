import { type FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createVirtualCard, setPin } from '../lib/api';
import { useNavigate } from 'react-router-dom';


const SettingsPage = () => {
    const navigate = useNavigate()
  const { user, token, updateUser } = useAuth();
  const [pin, setPinValue] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user || !token) {
    return (
      <section className="card">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-slate-500">Sign in to manage your security settings.</p>
      </section>
    );
  }

  const handlePinSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    try {
      const response = await setPin(token, pin);
      updateUser({ ...user, pinSet: response.pinSet });
      setStatus('PIN updated successfully.');
      setPinValue('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCardCreate = async () => {
    setStatus(null);
    setError(null);
    try {
      const card = await createVirtualCard(token);
      updateUser({ ...user, virtualCard: card });
      setStatus('Virtual card created.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
         <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>
      <div className="card">
        <h2 className="text-xl font-semibold text-bonavy-700">Security PIN</h2>
        <p className="text-sm text-slate-500">Required for withdrawals and transfers.</p>
        <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">4-digit PIN</label>
            <input
              className="input mt-2"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(event) => setPinValue(event.target.value)}
              placeholder="••••"
              required
            />
          </div>
          <button className="btn-primary" type="submit">Save PIN</button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-bonavy-700">Virtual card</h2>
        <p className="text-sm text-slate-500">Create one simulated card for online purchases.</p>
        <div className="mt-6 space-y-4">
          {user.virtualCard ? (
            <div className="rounded-2xl border border-slate-200 bg-bocream-100 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Virtual Card</p>
              <p className="mt-2 text-lg font-semibold text-bonavy-700">•••• •••• •••• {user.virtualCard.last4}</p>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Exp {user.virtualCard.expiryMonth}/{user.virtualCard.expiryYear}</span>
                <span>CVV •••</span>
              </div>
            </div>
          ) : (
            <button className="btn-secondary" type="button" onClick={handleCardCreate}>
              Create virtual card
            </button>
          )}
        </div>
      </div>

      {(status || error) && (
        <div className="card lg:col-span-2">
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </section>
  );
};

export default SettingsPage;