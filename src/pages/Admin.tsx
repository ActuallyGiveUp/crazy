import React, { useState, useEffect } from 'react';
import { Shield, Users, Settings, BarChart3, DollarSign, Crown, Trash2, Edit, Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  createdAt: string;
  stats: {
    totalBets: number;
    totalWins: number;
    totalLosses: number;
    biggestWin: number;
    biggestLoss: number;
  };
}

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    balance: 0,
    isAdmin: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('charlies-odds-users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  };

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin
    });
    setShowEditModal(true);
  };

  const saveUserChanges = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, ...editForm }
        : u
    );
    
    saveUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const addBalance = (userId: string, amount: number) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, balance: u.balance + amount }
        : u
    );
    saveUsers(updatedUsers);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalBets = users.reduce((sum, u) => sum + u.stats.totalBets, 0);
  const adminUsers = users.filter(u => u.isAdmin).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Crown className="w-8 h-8 text-yellow-400 mr-3" />
          Admin Dashboard
        </h1>
        <p className="text-gray-400">Manage users, monitor activity, and configure platform settings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">${totalBalance.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bets</p>
              <p className="text-2xl font-bold text-white">{totalBets}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admin Users</p>
              <p className="text-2xl font-bold text-white">{adminUsers}</p>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
            />
          </div>
        </div>

        {/* Mobile-friendly user list */}
        <div className="space-y-4 md:hidden">
          {filteredUsers.map((u) => (
            <div key={u.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center">
                    <span className="text-white font-semibold">{u.username}</span>
                    {u.isAdmin && <Crown className="w-4 h-4 text-yellow-400 ml-2" />}
                  </div>
                  <div className="text-gray-400 text-sm">{u.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">${u.balance.toFixed(2)}</div>
                  <div className="text-gray-400 text-xs">{u.stats.totalBets} bets</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => editUser(u)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => addBalance(u.id, 100)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  +$100
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
                  disabled={u.id === user.id}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3">User</th>
                <th className="text-left text-gray-300 py-3">Email</th>
                <th className="text-left text-gray-300 py-3">Balance</th>
                <th className="text-left text-gray-300 py-3">Bets</th>
                <th className="text-left text-gray-300 py-3">Role</th>
                <th className="text-left text-gray-300 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 text-white">{u.username}</td>
                  <td className="py-3 text-gray-300">{u.email}</td>
                  <td className="py-3 text-green-400 font-semibold">${u.balance.toFixed(2)}</td>
                  <td className="py-3 text-gray-300">{u.stats.totalBets}</td>
                  <td className="py-3">
                    {u.isAdmin ? (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center w-fit">
                        <Crown className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">User</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editUser(u)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => addBalance(u.id, 100)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        +$100
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
                        disabled={u.id === user.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Balance</label>
                <input
                  type="number"
                  value={editForm.balance}
                  onChange={(e) => setEditForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isAdmin}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isAdmin: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-white">Admin User</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveUserChanges}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;