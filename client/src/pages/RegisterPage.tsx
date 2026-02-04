import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

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
    <section className="card">
      <h2>Create your account</h2>
      <p>No real money — this is a simulated environment.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Full name
          <input value={name} onChange={(event) => setName(event.target.value)} type="text" required />
        </label>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
    </section>
  );
};

export default RegisterPage;
