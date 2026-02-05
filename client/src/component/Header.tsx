import { Link } from 'react-router-dom';
import Logo from '../assets/Bank-of-America-Logo.png'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Bank Logo" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-boared-500 transition hover:text-boared-700"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-primary"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header