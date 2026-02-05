import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import authbg from '../assets/auth.jpg'

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const data = await loginUser({ identifier, password });
      setSession(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="card">
        <h2 className="text-2xl font-semibold text-bonavy-700">Sign in</h2>
        <p className="text-sm text-slate-500">Login using your 10-digit account number or user ID.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Account number or user ID</label>
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="input mt-2"
              placeholder="Account number or ID"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input mt-2"
              type="password"
              required
            />
          </div>
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>

        {/* Don't have an account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-boared-500 transition hover:text-boared-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Background image section - hidden on mobile */}
      <div 
        className="hidden lg:block relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authbg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-bonavy-700/60 to-bonavy-700/80" />
        <div className="relative z-10 flex h-full flex-col justify-center p-8 text-white">
          <h3 className="text-3xl font-semibold">Welcome back</h3>
          <p className="mt-4 text-lg text-white/90">
            Access your full dashboard, manage transfers, and create a virtual card from one secure place.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <p className="text-sm">View real-time balance & transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <p className="text-sm">Manage transfers & withdrawals</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <p className="text-sm">Secure banking anytime, anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;