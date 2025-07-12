import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, formatCurrency } = useAuth();

  const games = [
    { name: 'Dice', path: '/dice' },
    { name: 'Limbo', path: '/limbo' },
    { name: 'Crash', path: '/crash' },
    { name: 'Blackjack', path: '/blackjack' },
    { name: 'Plinko', path: '/plinko' },
    { name: 'Spin Wheel', path: '/spin-wheel' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <span className="text-gray-900 font-black text-xs tracking-wider">CO</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:translate-x-8 transition-transform duration-700"></div>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">CharliesOdds</span>
              <span className="text-xs text-yellow-400 font-semibold -mt-1">DEMO CASINO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Games
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {games.map((game) => (
                    <Link
                      key={game.path}
                      to={game.path}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(game.path) ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {game.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link 
              to="/analytics" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/analytics') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Analytics
            </Link>
            
            <Link 
              to="/changelog" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/changelog') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Changelog
            </Link>
            
            <Link 
              to="/suggestions" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/suggestions') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Suggestions
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.username}</span>
                  <span className="text-yellow-400 font-semibold">{formatCurrency(user.balance)}</span>
                </div>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'bg-red-400 text-gray-900' : 'text-red-400 hover:text-red-300'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {games.map((game) => (
              <Link
                key={game.path}
                to={game.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(game.path) ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {game.name}
              </Link>
            ))}
            <Link
              to="/analytics"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/analytics') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              to="/changelog"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/changelog') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Changelog
            </Link>
            <Link
              to="/suggestions"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/suggestions') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Suggestions
            </Link>
            
            {/* Mobile User Menu */}
            {user ? (
              <>
                <div className="px-3 py-2 text-white border-t border-gray-700 mt-2 pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4" />
                    <span>{user.username}</span>
                    <span className="text-yellow-400 font-semibold">{formatCurrency(user.balance)}</span>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/profile') ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/admin') ? 'bg-red-400 text-gray-900' : 'text-red-400 hover:text-red-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 border-t border-gray-700 mt-2 pt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500 mx-3 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;