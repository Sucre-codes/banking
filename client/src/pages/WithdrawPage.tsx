import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdraw } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const formatCents = (value: number, isEuro = false) => {
  const currency = isEuro ? 'EUR' : 'USD';
  
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency });
};

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [beneficiary, setBeneficiary] = useState({
    name: '',
    email: '',
    bank: '',
    account: '',
    routing: '',
    swift: '',
    iban: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if using Euro based on IBAN/SWIFT or USD based on routing
  const isEuroTransfer = (beneficiary.iban || beneficiary.swift) && !beneficiary.routing;
  const currencySymbol = isEuroTransfer ? '€' : '$';
  const currency = isEuroTransfer ? 'EUR' : 'USD';

  // Handle routing number change - clear IBAN and SWIFT when routing is entered
  const handleRoutingChange = (value: string) => {
    setBeneficiary({ 
      ...beneficiary, 
      routing: value,
      iban: '',
      swift: ''
    });
  };

  // Handle IBAN change - clear routing when IBAN is entered
  const handleIbanChange = (value: string) => {
    setBeneficiary({ 
      ...beneficiary, 
      iban: value,
      routing: beneficiary.routing && value ? '' : beneficiary.routing
    });
  };

  // Handle SWIFT change - clear routing when SWIFT is entered
  const handleSwiftChange = (value: string) => {
    setBeneficiary({ 
      ...beneficiary, 
      swift: value,
      routing: beneficiary.routing && value ? '' : beneficiary.routing
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const amountCents = Math.round(Number(amount) * 100);
      const balanceCents = await withdraw(token, {
        amountCents,
        pin,
        beneficiaryName: beneficiary.name,
        beneficiaryEmail: beneficiary.email,
        beneficiaryBank: beneficiary.bank,
        beneficiaryAccount: beneficiary.account,
        beneficiaryIbanNumber: beneficiary.iban || undefined,
        beneficiaryRoutingNumber: beneficiary.routing || undefined,
        beneficiarySwiftCode: beneficiary.swift || undefined
      });

      updateUser({ ...user, balanceCents });
      setSuccess(true);
      setAmount('');
      setPin('');
      setBeneficiary({
        name: '',
        email: '',
        bank: '',
        account: '',
        routing: '',
        swift: '',
        iban: ''
      });

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

  const insufficientFunds = !!(
    Number(amount) > 0 && user.balanceCents < Math.round(Number(amount) * 100)
  );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-bonavy-700">Withdraw Funds</h1>
        <p className="mt-2 text-slate-600">Send money to an external bank account</p>
      </div>

      {/* PIN Warning */}
      {!user.pinSet && (
        <div className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900">PIN Required</p>
              <p className="mt-1 text-sm text-amber-700">
                You must set up a 4-digit PIN before making withdrawals.
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="mt-2 text-sm font-semibold text-amber-900 underline hover:text-amber-700"
              >
                Go to Settings →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Info */}
      {(beneficiary.routing || beneficiary.iban || beneficiary.swift) && (
        <div className="mb-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💱</span>
            <div>
              <p className="font-semibold text-blue-900">Currency: {currency}</p>
              <p className="mt-1 text-sm text-blue-700">
                {isEuroTransfer 
                  ? 'Transfer will be processed in Euros (EUR) based on IBAN/SWIFT'
                  : 'Transfer will be processed in US Dollars (USD) based on routing number'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-xl border-l-4 border-green-500 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">Withdrawal Successful!</p>
              <p className="mt-1 text-sm text-green-700">
                Confirmation email sent to beneficiary. Redirecting...
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
              <p className="font-semibold text-red-900">Withdrawal Failed</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Funds Warning */}
      {insufficientFunds && (
        <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-900">Insufficient Funds</p>
              <p className="mt-1 text-sm text-red-700">
                Your balance ({formatCents(user.balanceCents)}) is less than the withdrawal amount.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Amount and PIN */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Amount ({currency})</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                    {currencySymbol}
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
                    disabled={loading || !user.pinSet}
                  />
                </div>
              </div>

              <div>
                <label className="label">4-Digit PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="input mt-2"
                  placeholder="••••"
                  maxLength={4}
                  required
                  disabled={loading || !user.pinSet}
                />
              </div>
            </div>

            {/* Beneficiary Details */}
            <div>
              <h3 className="mb-4 font-semibold text-slate-900">Beneficiary Information</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={beneficiary.name}
                      onChange={(e) => setBeneficiary({ ...beneficiary, name: e.target.value })}
                      className="input mt-2"
                      required
                      disabled={loading || !user.pinSet}
                    />
                  </div>

                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={beneficiary.email}
                      onChange={(e) => setBeneficiary({ ...beneficiary, email: e.target.value })}
                      className="input mt-2"
                      required
                      disabled={loading || !user.pinSet}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Bank Name</label>
                    <input
                      type="text"
                      value={beneficiary.bank}
                      onChange={(e) => setBeneficiary({ ...beneficiary, bank: e.target.value })}
                      className="input mt-2"
                      required
                      disabled={loading || !user.pinSet}
                    />
                  </div>

                  <div>
                    <label className="label">Account Number</label>
                    <input
                      type="text"
                      value={beneficiary.account}
                      onChange={(e) => setBeneficiary({ ...beneficiary, account: e.target.value })}
                      className="input mt-2"
                      required
                      disabled={loading || !user.pinSet}
                    />
                  </div>
                </div>

                {/* Optional fields with mutual exclusivity */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label">
                      Routing Number (USD)
                      {beneficiary.routing && <span className="ml-1 text-green-600">✓</span>}
                    </label>
                    <input
                      type="text"
                      value={beneficiary.routing}
                      onChange={(e) => handleRoutingChange(e.target.value)}
                      className="input mt-2"
                      disabled={loading || !user.pinSet || !!(beneficiary.iban || beneficiary.swift)}
                      placeholder={beneficiary.iban || beneficiary.swift ? 'Disabled (EUR active)' : ''}
                    />
                    {beneficiary.routing && (
                      <p className="mt-1 text-xs text-green-600">USD transfer</p>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      SWIFT Code (EUR)
                      {beneficiary.swift && <span className="ml-1 text-blue-600">✓</span>}
                    </label>
                    <input
                      type="text"
                      value={beneficiary.swift}
                      onChange={(e) => handleSwiftChange(e.target.value)}
                      className="input mt-2"
                      disabled={loading || !user.pinSet || !!beneficiary.routing}
                      placeholder={beneficiary.routing ? 'Disabled (USD active)' : ''}
                    />
                    {beneficiary.swift && !beneficiary.routing && (
                      <p className="mt-1 text-xs text-blue-600">EUR transfer</p>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      IBAN (EUR)
                      {beneficiary.iban && <span className="ml-1 text-blue-600">✓</span>}
                    </label>
                    <input
                      type="text"
                      value={beneficiary.iban}
                      onChange={(e) => handleIbanChange(e.target.value)}
                      className="input mt-2"
                      disabled={loading || !user.pinSet || !!beneficiary.routing}
                      placeholder={beneficiary.routing ? 'Disabled (USD active)' : ''}
                    />
                    {beneficiary.iban && !beneficiary.routing && (
                      <p className="mt-1 text-xs text-blue-600">EUR transfer</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !user.pinSet || insufficientFunds}
            >
              {loading ? 'Processing...' : 'Submit Withdrawal'}
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Balance Info */}
          <div className="card bg-gradient-to-br from-bonavy-700 to-boared-700 text-white">
            <p className="text-sm font-medium text-white/70">Available Balance</p>
            <p className="mt-2 text-2xl font-bold">{formatCents(user.balanceCents)}</p>
            {amount && Number(amount) > 0 && !insufficientFunds && (
              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-sm text-white/70">After Withdrawal</p>
                <p className="mt-1 text-xl font-bold">
                  {formatCents(user.balanceCents - Math.round(Number(amount) * 100))}
                </p>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="card">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Secure Process</p>
                <p className="mt-1 text-xs text-slate-600">
                  Withdrawals are protected with PIN verification and email confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Currency Info */}
          <div className="card">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Currency Selection</p>
                <p className="mt-1 text-xs text-slate-600">
                  • Routing Number → USD transfer
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  • IBAN/SWIFT → EUR transfer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
