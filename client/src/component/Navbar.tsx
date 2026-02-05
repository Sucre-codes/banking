
import {  Link } from 'react-router-dom';

import Logo from '../assets/Bank-of-America-Logo.png'

const Navbar = () => {
  

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={Logo} alt="Bank Logo" className="h-8 w-auto" />
        </Link>
        </div>
    </nav>
  );
};

export default Navbar;
