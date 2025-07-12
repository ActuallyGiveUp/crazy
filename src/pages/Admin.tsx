import React, { useState, useEffect } from 'react';
import { Shield, Users, Settings, BarChart3, DollarSign, Activity, Gamepad2, Sliders, UserPlus, Trash2, Edit3, Save, X, MessageSquare, ThumbsUp, ThumbsDown, Eye, CheckCircle, Clock, Zap, AlertTriangle, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  createdAt: Date;
  stats: {
    totalBets: number;
    totalWins: number;
    totalLosses: number;
    biggestWin: number;
    biggestLoss: number;
  };
}

interface GameSettings {
  dice: {
    minBet: number;
    maxBet: number;
    houseEdge: number;
    maxWinChance: number;
    minWinChance: number;
    enabled: boolean;
    instantBetOptions: number[];
  };
  limbo: {
    minBet: number;
    maxBet: number;
    maxMultiplier: number;
    houseEdge: number;
    enabled: boolean;
    defaultMultipliers: number[];
  };
  crash: {
    minBet: number;
    maxBet: number;
    maxMultiplier: number;
    enabled: boolean;
    autoCashoutOptions: number[];
  };
  blackjack: {
    minBet: number;
    maxBet: number;
    blackjackPayout: number;
    enabled: boolean;
    deckCount: number;
  };
  plinko: {
    minBet: number;
    maxBet: number;
    enabled: boolean;
    ballCount: number;
    multiplierRows: number;
  };
  spinWheel: {
    minBet: number;
    maxBet: number;
    enabled: boolean;
    segmentCount: number;
    customMultipliers: number[];
  };
}

interface SiteSettings {
  siteName: string;
  defaultBalance: number;
  maxAutoBets: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  theme: 'dark' | 'light';
  currency: string;
  timeZone: string;
  maxBetHistory: number;
  sessionTimeout: number;
  enableSounds: boolean;
  enableAnimations: boolean;
  showWelcomeBonus: boolean;
  welcomeBonusAmount: number;
}

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'games' | 'settings' | 'suggestions'>('overview');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', balance: 1000, isAdmin: false });
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [editingSuggestion, setEditingSuggestion] = useState<any>(null);
  const [adminResponse, setAdminResponse] = useState('');
  
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    dice: { 
      minBet: 0.01, maxBet: 1000, houseEdge: 1, maxWinChance: 98, minWinChance: 1, enabled: true,
      instantBetOptions: [10, 25, 50, 75]
    },
    limbo: { 
      minBet: 0.01, maxBet: 1000, maxMultiplier: 1000, houseEdge: 1, enabled: true,
      defaultMultipliers: [2, 5, 10, 50, 100]
    },
    crash: { 
      minBet: 0.01, maxBet: 1000, maxMultiplier: 100, enabled: true,
      autoCashoutOptions: [1.5, 2, 3, 5, 10]
    },
    blackjack: { 
      minBet: 0.01, maxBet: 1000, blackjackPayout: 1.5, enabled: true,
      deckCount: 6
    },
    plinko: { 
      minBet: 0.01, maxBet: 1000, enabled: true,
      ballCount: 1, multiplierRows: 16
    },
    spinWheel: { 
      minBet: 0.01, maxBet: 1000, enabled: true,
      segmentCount: 12, customMultipliers: [1.5, 2, 2.5, 3, 5, 10]
    },
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'CharliesOdds',
    defaultBalance: 1000,
    maxAutoBets: 10000,
    maintenanceMode: false,
    registrationEnabled: true,
    theme: 'dark',
    currency: 'USD',
    timeZone: 'UTC',
    maxBetHistory: 1000,
    sessionTimeout: 3600,
    enableSounds: true,
    enableAnimations: true,
    showWelcomeBonus: true,
    welcomeBonusAmount: 100,
  });

  const [siteStats, setSiteStats] = useState({
    totalUsers: 0,
    totalBets: 0,
    totalWagered: 0,
    totalWinnings: 0,
    houseEdge: 0,
  });

  useEffect(() => {
    // Load users from localStorage or use defaults
    const storedUsers = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    if (storedUsers.length === 0) {
      const defaultUsers = [
        {
          id: 'admin',
          username: 'Admin',
          email: 'admin@charliesodds.com',
          balance: 100000,
          isAdmin: true,
          createdAt: new Date(),
          stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 }
        },
        {
          id: 'demo',
          username: 'Demo Player',
          email: 'demo@charliesodds.com',
          balance: 1000,
          isAdmin: false,
          createdAt: new Date(),
          stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 }
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('charlies-odds-users', JSON.stringify(defaultUsers));
    } else {
      setUsers(storedUsers);
    }
    
    // Load game settings
    const storedSettings = localStorage.getItem('charlies-odds-game-settings');
    if (storedSettings) {
      setGameSettings(JSON.parse(storedSettings));
    }
    
    // Load suggestions
    const savedSuggestions = localStorage.getItem('charlies-odds-suggestions');
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
    
    // Calculate site statistics
    const totalUsers = storedUsers.length;
    const totalBets = storedUsers.reduce((sum: number, u: AdminUser) => sum + u.stats.totalBets, 0);
    const totalWagered = storedUsers.reduce((sum: number, u: AdminUser) => sum + (u.stats.totalBets * 10), 0);
    const totalWinnings = storedUsers.reduce((sum: number, u: AdminUser) => sum + u.stats.biggestWin, 0);
    const houseEdge = totalWagered > 0 ? ((totalWagered - totalWinnings) / totalWagered) * 100 : 0;
    
    setSiteStats({ totalUsers, totalBets, totalWagered, totalWinnings, houseEdge });
  }, []);

  const updateUserBalance = (userId: string, newBalance: number) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, balance: newBalance } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
    
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, balance: newBalance });
    }
  };

  const updateUser = (userId: string, updates: Partial<AdminUser>) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
    
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, ...updates });
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  const createUser = () => {
    if (!newUser.username || !newUser.email) return;
    
    const user = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date(),
      stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 }
    };
    
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
    
    setNewUser({ username: '', email: '', password: '', balance: 1000, isAdmin: false });
    setShowNewUserForm(false);
  };

  const updateSuggestion = (id: number, updates: any) => {
    const updatedSuggestions = suggestions.map(suggestion =>
      suggestion.id === id ? { ...suggestion, ...updates } : suggestion
    );
    setSuggestions(updatedSuggestions);
    localStorage.setItem('charlies-odds-suggestions', JSON.stringify(updatedSuggestions));
  };

  const deleteSuggestion = (id: number) => {
    if (confirm('Are you sure you want to delete this suggestion?')) {
      const updatedSuggestions = suggestions.filter(suggestion => suggestion.id !== id);
      setSuggestions(updatedSuggestions);
      localStorage.setItem('charlies-odds-suggestions', JSON.stringify(updatedSuggestions));
    }
  };

  const addAdminResponse = (id: number) => {
    if (!adminResponse.trim()) return;
    
    const response = {
      id: Date.now(),
      text: adminResponse,
      author: user?.username || 'Admin',
      timestamp: new Date().toISOString()
    };
    
    updateSuggestion(id, {
      adminResponses: [...(suggestions.find(s => s.id === id)?.adminResponses || []), response]
    });
    
    setAdminResponse('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-gray-600';
      case 'under-review': return 'bg-yellow-600';
      case 'planned': return 'bg-blue-600';
      case 'in-progress': return 'bg-purple-600';
      case 'completed': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <Plus className="w-4 h-4 text-green-400" />;
      case 'bug': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'improvement': return <Zap className="w-4 h-4 text-yellow-400" />;
      default: return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const saveGameSettings = () => {
    localStorage.setItem('charlies-odds-game-settings', JSON.stringify(gameSettings));
    localStorage.setItem('charlies-odds-site-settings', JSON.stringify(siteSettings));
    alert('Game settings saved successfully!');
  };

  const exportSettings = () => {
    const allSettings = {
      gameSettings,
      siteSettings,
      users: users.map(u => ({ ...u, password: undefined })), // Don't export passwords
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `charlies-odds-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        if (settings.gameSettings) setGameSettings(settings.gameSettings);
        if (settings.siteSettings) setSiteSettings(settings.siteSettings);
        if (settings.users) setUsers(settings.users);
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Error importing settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-red-400" />
          Admin Dashboard
        </h1>
        <p className="text-gray-400">Comprehensive platform management and configuration</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'suggestions', name: `Suggestions (${suggestions.length})`, icon: MessageSquare },
              { id: 'games', name: 'Game Settings', icon: Gamepad2 },
              { id: 'settings', name: 'Site Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{siteStats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bets</p>
                <p className="text-2xl font-bold text-white">{siteStats.totalBets.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Wagered</p>
                <p className="text-2xl font-bold text-white">${siteStats.totalWagered.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Winnings</p>
                <p className="text-2xl font-bold text-white">${siteStats.totalWinnings.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">House Edge</p>
                <p className="text-2xl font-bold text-white">{siteStats.houseEdge.toFixed(2)}%</p>
              </div>
              <Settings className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </h2>
                <button
                  onClick={() => setShowNewUserForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>
              
              {showNewUserForm && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-semibold mb-3">Create New User</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    />
                    <input
                      type="number"
                      placeholder="Starting Balance"
                      value={newUser.balance}
                      onChange={(e) => setNewUser({ ...newUser, balance: Number(e.target.value) })}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    />
                  </div>
                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={newUser.isAdmin}
                      onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isAdmin" className="text-white">Admin User</label>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={createUser}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewUserForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((adminUser) => (
                  <div 
                    key={adminUser.id} 
                    className={`flex items-center justify-between bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors ${
                      selectedUser?.id === adminUser.id ? 'ring-2 ring-yellow-400' : ''
                    }`}
                    onClick={() => setSelectedUser(adminUser)}
                  >
                    <div>
                      <p className="text-white font-semibold">{adminUser.username}</p>
                      <p className="text-gray-400 text-sm">{adminUser.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">${adminUser.balance.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          adminUser.isAdmin ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {adminUser.isAdmin ? 'Admin' : 'Player'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(adminUser.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            {selectedUser ? (
              <>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">User Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Username</p>
                      {editingUser === selectedUser.id ? (
                        <input
                          type="text"
                          value={selectedUser.username}
                          onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                      ) : (
                        <p className="text-white font-semibold">{selectedUser.username}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      {editingUser === selectedUser.id ? (
                        <input
                          type="email"
                          value={selectedUser.email}
                          onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                      ) : (
                        <p className="text-white">{selectedUser.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Balance</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={selectedUser.balance}
                          onChange={(e) => setSelectedUser({ ...selectedUser, balance: Number(e.target.value) })}
                          className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          step="0.01"
                        />
                        <button
                          onClick={() => updateUserBalance(selectedUser.id, selectedUser.balance)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-semibold py-1 px-2 rounded"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Account Type</p>
                      <button
                        onClick={() => updateUser(selectedUser.id, { isAdmin: !selectedUser.isAdmin })}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                          selectedUser.isAdmin 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {selectedUser.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {editingUser === selectedUser.id ? (
                        <>
                          <button
                            onClick={() => {
                              updateUser(selectedUser.id, { 
                                username: selectedUser.username, 
                                email: selectedUser.email 
                              });
                              setEditingUser(null);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingUser(selectedUser.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">User Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Bets</span>
                      <span className="text-white">{selectedUser.stats.totalBets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wins</span>
                      <span className="text-green-400">{selectedUser.stats.totalWins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Losses</span>
                      <span className="text-red-400">{selectedUser.stats.totalLosses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-white">
                        {selectedUser.stats.totalBets > 0 
                          ? ((selectedUser.stats.totalWins / selectedUser.stats.totalBets) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Biggest Win</span>
                      <span className="text-green-400">${selectedUser.stats.biggestWin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Biggest Loss</span>
                      <span className="text-red-400">${Math.abs(selectedUser.stats.biggestLoss).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-center">Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Management */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Suggestions Management</h2>
            <div className="text-sm text-gray-400">
              {suggestions.length} total suggestions
            </div>
          </div>

          {/* Suggestions Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {['open', 'under-review', 'planned', 'in-progress', 'completed', 'rejected'].map(status => {
              const count = suggestions.filter(s => s.status === status).length;
              return (
                <div key={status} className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-xs text-gray-400 capitalize">{status.replace('-', ' ')}</div>
                </div>
              );
            })}
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(suggestion.category)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">#{suggestion.id}</span>
                          <span className="text-sm text-gray-400 capitalize">{suggestion.category}</span>
                          <span className={`text-sm font-medium ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority} priority
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          By {suggestion.author} • {new Date(suggestion.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(suggestion.status)}`}>
                        {suggestion.status.replace('-', ' ')}
                      </span>
                      <button
                        onClick={() => setEditingSuggestion(editingSuggestion === suggestion.id ? null : suggestion.id)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSuggestion(suggestion.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{suggestion.text}</p>

                  {/* Voting Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-white">{suggestion.upvotes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="w-4 h-4 text-red-400" />
                      <span className="text-white">{suggestion.downvotes || 0}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Net Score: {(suggestion.upvotes || 0) - (suggestion.downvotes || 0)}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => updateSuggestion(suggestion.id, { status: 'under-review' })}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-lg transition-colors"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Review
                    </button>
                    <button
                      onClick={() => updateSuggestion(suggestion.id, { status: 'planned' })}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateSuggestion(suggestion.id, { status: 'in-progress' })}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      In Progress
                    </button>
                    <button
                      onClick={() => updateSuggestion(suggestion.id, { status: 'completed' })}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Complete
                    </button>
                    <button
                      onClick={() => updateSuggestion(suggestion.id, { status: 'rejected' })}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3 inline mr-1" />
                      Reject
                    </button>
                  </div>

                  {/* Admin Responses */}
                  {suggestion.adminResponses && suggestion.adminResponses.length > 0 && (
                    <div className="bg-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-3">Admin Responses:</h4>
                      <div className="space-y-2">
                        {suggestion.adminResponses.map((response: any) => (
                          <div key={response.id} className="bg-gray-600 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-yellow-400 font-semibold text-sm">{response.author}</span>
                              <span className="text-gray-400 text-xs">
                                {new Date(response.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-200 text-sm">{response.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Response */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Add Admin Response:</h4>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        placeholder="Type your response..."
                        className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={() => addAdminResponse(suggestion.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editingSuggestion === suggestion.id && (
                    <div className="mt-4 bg-gray-700 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Edit Suggestion:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Status</label>
                          <select
                            value={suggestion.status}
                            onChange={(e) => updateSuggestion(suggestion.id, { status: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="open">Open</option>
                            <option value="under-review">Under Review</option>
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Priority</label>
                          <select
                            value={suggestion.priority}
                            onChange={(e) => updateSuggestion(suggestion.id, { priority: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Category</label>
                          <select
                            value={suggestion.category}
                            onChange={(e) => updateSuggestion(suggestion.id, { category: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="feature">Feature</option>
                            <option value="improvement">Improvement</option>
                            <option value="bug">Bug</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Suggestion Text</label>
                        <textarea
                          value={suggestion.text}
                          onChange={(e) => updateSuggestion(suggestion.id, { text: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {suggestions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Suggestions Yet</h3>
                <p className="text-gray-500">Suggestions will appear here when users submit them.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Game Configuration</h2>
            <button
              onClick={saveGameSettings}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save All Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(gameSettings).map(([gameKey, settings]) => (
              <div key={gameKey} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white capitalize">{gameKey}</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => setGameSettings(prev => ({
                        ...prev,
                        [gameKey]: { ...prev[gameKey as keyof GameSettings], enabled: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-300">Enabled</span>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Min Bet ($)</label>
                    <input
                      type="number"
                      value={settings.minBet}
                      onChange={(e) => setGameSettings(prev => ({
                        ...prev,
                        [gameKey]: { ...prev[gameKey as keyof GameSettings], minBet: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Max Bet ($)</label>
                    <input
                      type="number"
                      value={settings.maxBet}
                      onChange={(e) => setGameSettings(prev => ({
                        ...prev,
                        [gameKey]: { ...prev[gameKey as keyof GameSettings], maxBet: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                  
                  {/* Game-specific settings */}
                  {gameKey === 'dice' && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">House Edge (%)</label>
                        <input
                          type="number"
                          value={settings.houseEdge}
                          onChange={(e) => setGameSettings(prev => ({
                            ...prev,
                            dice: { ...prev.dice, houseEdge: Number(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          step="0.1"
                          min="0"
                          max="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Max Win Chance (%)</label>
                        <input
                          type="number"
                          value={settings.maxWinChance}
                          onChange={(e) => setGameSettings(prev => ({
                            ...prev,
                            dice: { ...prev.dice, maxWinChance: Number(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          min="1"
                          max="99"
                        />
                      </div>
                    </>
                  )}
                  
                  {(gameKey === 'limbo' || gameKey === 'crash') && 'maxMultiplier' in settings && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Max Multiplier</label>
                      <input
                        type="number"
                        value={settings.maxMultiplier}
                        onChange={(e) => setGameSettings(prev => ({
                          ...prev,
                          [gameKey]: { ...prev[gameKey as keyof GameSettings], maxMultiplier: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        step="0.1"
                        min="1"
                      />
                    </div>
                  )}
                  
                  {gameKey === 'blackjack' && 'blackjackPayout' in settings && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Blackjack Payout</label>
                      <input
                        type="number"
                        value={settings.blackjackPayout}
                        onChange={(e) => setGameSettings(prev => ({
                          ...prev,
                          blackjack: { ...prev.blackjack, blackjackPayout: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        step="0.1"
                        min="1"
                        max="3"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Site Configuration */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Site Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Site Name</label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Default Starting Balance ($)</label>
                <input
                  type="number"
                  value={siteSettings.defaultBalance}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, defaultBalance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  step="1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Max Auto-Bet Count</label>
                <input
                  type="number"
                  value={siteSettings.maxAutoBets}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, maxAutoBets: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  step="1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Currency</label>
                <select
                  value={siteSettings.currency}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="BTC">BTC (₿)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Theme</label>
                <select
                  value={siteSettings.theme}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, theme: e.target.value as 'dark' | 'light' }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Max Bet History</label>
                <input
                  type="number"
                  value={siteSettings.maxBetHistory}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, maxBetHistory: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  step="100"
                  min="100"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={siteSettings.maintenanceMode}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="mr-2" 
                  />
                  <span className="text-white">Maintenance Mode</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={siteSettings.registrationEnabled}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                    className="mr-2" 
                  />
                  <span className="text-white">Allow New Registrations</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={siteSettings.enableSounds}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, enableSounds: e.target.checked }))}
                    className="mr-2" 
                  />
                  <span className="text-white">Enable Sound Effects</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={siteSettings.enableAnimations}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                    className="mr-2" 
                  />
                  <span className="text-white">Enable Animations</span>
                </label>
              </div>
            </div>
          </div>

          {/* Import/Export Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Backup & Restore</h3>
            <div className="flex space-x-4">
              <button
                onClick={exportSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Export Settings
              </button>
              <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Game Template Creator */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Game Template Creator</h3>
            <p className="text-gray-300 mb-4">
              Create new game templates that can be easily implemented. This generates the basic structure and configuration for new games.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Game Name (e.g., Roulette)"
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <select className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                <option value="chance">Chance-based</option>
                <option value="skill">Skill-based</option>
                <option value="card">Card Game</option>
                <option value="wheel">Wheel Game</option>
              </select>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Generate Game Template
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to reset all user data? This cannot be undone.')) {
                    setUsers([]);
                    localStorage.removeItem('charlies-odds-users');
                    alert('All user data has been reset.');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Reset All User Data
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to reset game settings to defaults?')) {
                    setGameSettings({
                      dice: { minBet: 0.01, maxBet: 1000, houseEdge: 1, maxWinChance: 98, minWinChance: 1, enabled: true, instantBetOptions: [10, 25, 50, 75] },
                      limbo: { minBet: 0.01, maxBet: 1000, maxMultiplier: 1000, houseEdge: 1, enabled: true, defaultMultipliers: [2, 5, 10, 50, 100] },
                      crash: { minBet: 0.01, maxBet: 1000, maxMultiplier: 100, enabled: true, autoCashoutOptions: [1.5, 2, 3, 5, 10] },
                      blackjack: { minBet: 0.01, maxBet: 1000, blackjackPayout: 1.5, enabled: true, deckCount: 6 },
                      plinko: { minBet: 0.01, maxBet: 1000, enabled: true, ballCount: 1, multiplierRows: 16 },
                      spinWheel: { minBet: 0.01, maxBet: 1000, enabled: true, segmentCount: 12, customMultipliers: [1.5, 2, 2.5, 3, 5, 10] },
                    });
                    alert('Game settings have been reset to defaults.');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Reset Game Settings
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to clear all betting history? This cannot be undone.')) {
                    localStorage.removeItem('charlies-odds-bets');
                    alert('All betting history has been cleared.');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Clear All Betting History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;