import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, History, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

const Profile = () => {
  const { user, updateBalance, setCurrency, formatCurrency } = useAuth();
  const { clearHistory, seed, setSeed, bets, stats } = useGame();
  const [newSeed, setNewSeed] = useState(seed);
  const [balanceAmount, setBalanceAmount] = useState(100);
  const [balanceAction, setBalanceAction] = useState<'add' | 'remove'>('add');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSeedUpdate = () => {
    setSeed(newSeed);
  };

  const generateNewSeed = () => {
    const newRandomSeed = Math.random().toString(36).substring(2, 15);
    setNewSeed(newRandomSeed);
    setSeed(newRandomSeed);
  };

  const handleBalanceChange = () => {
    const amount = balanceAction === 'add' ? balanceAmount : -balanceAmount;
    updateBalance(amount);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your betting history? This action cannot be undone.')) {
      clearHistory();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
            
            {/* Earn Balance CTA */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Need More Balance?</h3>
                  <p className="text-green-100 text-sm">Complete tasks and spin the wheel for free money!</p>
                </div>
                <Link
                  to="/earn-balance"
                  className="bg-white hover:bg-gray-100 text-green-600 font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Earn Free Balance
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Need More Balance?</h3>
                  <p className="text-green-100 text-sm">Complete tasks and spin the wheel for free money!</p>
                </div>
                <Link
                  to="/earn-balance"
                  className="bg-white hover:bg-gray-100 text-green-600 font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Earn Free Balance
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Balance</span>
                <span className="text-2xl font-bold text-yellow-400">{formatCurrency(user.balance)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Account Type</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  user.isAdmin ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {user.isAdmin ? 'Admin' : 'Player'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currency Selection */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Currency Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Currency
                </label>
                <select
                  value={user.currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="BTC">Bitcoin (₿)</option>
                  <option value="ETH">Ethereum (Ξ)</option>
                  <option value="LTC">Litecoin (Ł)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  This only changes the display format. All values are converted for display purposes only.
                </p>
              </div>
            </div>
          </div>

          {/* Balance Management */}
          {/* Admin-Only Balance Management */}
          {user?.isAdmin && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Currency Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Balance Controls
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setBalanceAction('add')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          balanceAction === 'add' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Add Money
                      </button>
                      <button
                        onClick={() => setBalanceAction('remove')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          balanceAction === 'remove' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Remove Money
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={balanceAmount}
                        onChange={(e) => setBalanceAmount(Number(e.target.value))}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="1"
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Currency
                  </label>
                  <select
                    value={user.currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="BTC">Bitcoin (₿)</option>
                    <option value="ETH">Ethereum (Ξ)</option>
                    <option value="LTC">Litecoin (Ł)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    This only changes the display format. All values are converted for display purposes only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Game Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Game Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Random Seed
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSeed}
                    onChange={(e) => setNewSeed(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter custom seed"
                  />
                  <button
                    onClick={handleSeedUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={generateNewSeed}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Change the seed to get different random outcomes. This ensures provably fair gaming.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Your Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
                <p className="text-gray-400 text-sm">Total Bets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.totalWins}</p>
                <p className="text-gray-400 text-sm">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{stats.totalLosses}</p>
                <p className="text-gray-400 text-sm">Losses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.totalBets > 0 ? ((stats.totalWins / stats.totalBets) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-gray-400 text-sm">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.biggestWin)}</p>
                <p className="text-gray-400 text-sm">Biggest Win</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{formatCurrency(Math.abs(stats.biggestLoss))}</p>
                <p className="text-gray-400 text-sm">Biggest Loss</p>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <History className="w-5 h-5 mr-2" />
              Data Management
            </h3>
            <div className="space-y-4">
              <button
                onClick={handleClearHistory}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Clear Betting History
              </button>
              <p className="text-xs text-gray-400">
                This will permanently delete all your betting history and cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;