import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transfer, externalTransfer } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const formatCents = (value: number, isEuro = false) => {
  const currency = isEuro ? 'EUR' : 'USD';
  return (value / 100).toLocaleString('en-US', { style: 'currency', currency });
};

type TransferType = 'internal' | 'external';

const TransferPage = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [transferType, setTransferType] = useState<TransferType>('internal');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  
  // Internal transfer
  const [toAccountNumber, setToAccountNumber] = useState('');
  
  // External transfer
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
  const isEuroTransfer = transferType === 'external' && (beneficiary.iban || beneficiary.swift) && !beneficiary.routing;
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
      let balanceCents: number;

      if (transferType === 'internal') {
        balanceCents = await transfer(token, {
          amountCents,
          toAccountNumber,
          pin
        });
      } else {
        balanceCents = await externalTransfer(token, {
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
      }

      updateUser({ ...user, balanceCents });
      setSuccess(true);
      
      // Reset form
      setAmount('');
      setPin('');
      setToAccountNumber('');
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
        <h1 className="text-3xl font-bold text-bonavy-700">Transfer Money</h1>
        <p className="mt-2 text-slate-600">Send funds to another account</p>
      </div>

      {/* PIN Warning */}
      {!user.pinSet && (
        <div className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900">PIN Required</p>
              <p className="mt-1 text-sm text-amber-700">
                You must set up a 4-digit PIN before making transfers.
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

      {/* Currency Info for External Transfers */}
      {transferType === 'external' && (beneficiary.routing || beneficiary.iban || beneficiary.swift) && (
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
              <p className="font-semibold text-green-900">Transfer Successful!</p>
              <p className="mt-1 text-sm text-green-700">
                Your transfer has been completed. Redirecting...
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
              <p className="font-semibold text-red-900">Transfer Failed</p>
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
                Your balance ({formatCents(user.balanceCents)}) is less than the transfer amount.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Transfer Type Selector */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTransferType('internal')}
              className={`rounded-xl border-2 p-4 text-left transition ${
                transferType === 'internal'
                  ? 'border-boared-500 bg-boared-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                  transferType === 'internal' ? 'bg-boared-100' : 'bg-slate-100'
                }`}>
                  🏦
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Internal Transfer</p>
                  <p className="text-xs text-slate-500">To another account</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTransferType('external')}
              className={`rounded-xl border-2 p-4 text-left transition ${
                transferType === 'external'
                  ? 'border-boared-500 bg-boared-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                  transferType === 'external' ? 'bg-boared-100' : 'bg-slate-100'
                }`}>
                  🌐
                </div>
                <div>
                  <p className="font-semibold text-slate-900">External Transfer</p>
                  <p className="text-xs text-slate-500">To another bank</p>
                </div>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Amount and PIN */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Amount ({transferType === 'external' ? currency : 'USD'})</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                    {transferType === 'external' ? currencySymbol : '$'}
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

            {/* Internal Transfer Fields */}
            {transferType === 'internal' && (
              <div>
                <label className="label">Recipient Account Number</label>
                <input
                  type="text"
                  value={toAccountNumber}
                  onChange={(e) => setToAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="input mt-2"
                  placeholder="10-digit account number"
                  maxLength={10}
                  required
                  disabled={loading || !user.pinSet}
                />
                <p className="mt-2 text-xs text-slate-500">Enter the 10-digit account number</p>
              </div>
            )}

            {/* External Transfer Fields */}
            {transferType === 'external' && (
              <div>
                <h3 className="mb-4 font-semibold text-slate-900">Recipient Information</h3>
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
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-slate-700">Bank Transfer Details</h4>
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
                          placeholder={beneficiary.iban || beneficiary.swift ? 'Disabled (EUR)' : ''}
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
                          placeholder={beneficiary.routing ? 'Disabled (USD)' : ''}
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
                          placeholder={beneficiary.routing ? 'Disabled (USD)' : ''}
                        />
                        {beneficiary.iban && !beneficiary.routing && (
                          <p className="mt-1 text-xs text-blue-600">EUR transfer</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !user.pinSet || insufficientFunds}
            >
              {loading ? 'Processing...' : `Send ${transferType === 'internal' ? 'Internal' : 'External'} Transfer`}
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
                <p className="text-sm text-white/70">After Transfer</p>
                <p className="mt-1 text-xl font-bold">
                  {formatCents(user.balanceCents - Math.round(Number(amount) * 100))}
                </p>
              </div>
            )}
          </div>

          {/* Transfer Info */}
          <div className="card">
            <h3 className="font-semibold text-slate-900">
              {transferType === 'internal' ? 'Internal Transfer' : 'External Transfer'}
            </h3>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              {transferType === 'internal' ? (
                <>
                  <p>• Instant transfer to another account</p>
                  <p>• No fees applied</p>
                  <p>• Recipient receives funds immediately</p>
                </>
              ) : (
                <>
                  <p>• Transfer to external bank account</p>
                  <p>• Recipient receives email notification</p>
                  <p>• Processing time: 1-3 business days</p>
                </>
              )}
            </div>
          </div>

          {/* Currency Info for External */}
          {transferType === 'external' && (
            <div className="card">
              <div className="flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Currency Selection</p>
                  <p className="mt-1 text-xs text-slate-600">
                    • Routing Number → USD
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    • IBAN/SWIFT → EUR
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="card">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Secure Transfer</p>
                <p className="mt-1 text-xs text-slate-600">
                  All transfers are encrypted and PIN-protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
