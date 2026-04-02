import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard, ListOrdered } from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center gap-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900">SAVEmore</span>
            </div>
            <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Link>
              <Link
                to="/transactions"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  isActive('/transactions')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <ListOrdered className="mr-2 h-4 w-4" /> Transactions
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 hidden text-sm text-gray-600 sm:block">Hello, {user?.displayName || 'User'}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded text-sm font-medium text-gray-500 transition hover:text-gray-700 focus:outline-none"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
