import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import authbg from '../assets/auth.jpg'

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const data = await registerUser({ name, email, password });
      setSession(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card">
        <h2 className="text-2xl font-semibold text-bonavy-700">Create your account</h2>
        <p className="text-sm text-slate-500">
          This is a simulated experience. We'll issue a 10-digit account number after registration.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" type="email" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2" type="password" required />
          </div>
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        
        {/* Already have an account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-boared-500 transition hover:text-boared-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Background image section - hidden on mobile */}
      <div 
        className="hidden lg:block relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authbg})`}}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-bonavy-700/60 to-bonavy-700/80" />
        <div className="relative z-10 flex h-full flex-col justify-center p-8 text-white">
          <h3 className="text-3xl font-semibold">Premium onboarding</h3>
          <p className="mt-4 text-lg text-white/90">
            Capture key details, issue account numbers, and get started with secure transfers right away.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <p className="text-sm">Instant account creation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <p className="text-sm">10-digit account number issued</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <p className="text-sm">Start transferring immediately</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;