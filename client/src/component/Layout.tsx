import { type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bocream-100">
      {/* Show Header for unauthenticated users, Navbar for authenticated users */}
      {user ? <Navbar /> : <Header />}

      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>

      <footer className="border-t border-bonavy-500 bg-bonavy-500">
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="text-sm font-semibold text-white">Bank Of America Digital</p>
      <p className="text-xs text-white/70">Digital-first banking designed for instant transfers and complete financial control.</p>
    </div>
    <div className="flex flex-wrap gap-4 text-sm text-white/80">
      <a href="/about" className="hover:text-white">Company</a>
      <a href="/help" className="hover:text-white">Support</a>
      <a href="/" className="hover:text-white">Security</a>
      <a href="/" className="hover:text-white">Privacy</a>
    </div>
    <div className="flex gap-3">
      <button className="btn-secondary" type="button">Open an account</button>
      <button className="btn-primary" type="button">Get the app</button>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Layout;
