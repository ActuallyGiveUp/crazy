import React, { useState, useEffect } from 'react';
import { Coins, Gift, Clock, Target, Users, Star, Trophy, Zap, CheckCircle, RotateCcw, Play, Calendar, Award, Heart, Gamepad2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ReactNode;
  category: 'daily' | 'gaming' | 'social' | 'special';
  completed: boolean;
  cooldown?: number; // in hours
  lastCompleted?: number;
}

const EarnBalance = () => {
  const { user, updateBalance, formatCurrency } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpin, setLastSpin] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Initialize tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem('charlies-odds-tasks');
    const savedLastSpin = localStorage.getItem('charlies-odds-last-spin');
    
    if (savedLastSpin) {
      setLastSpin(Number(savedLastSpin));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaultTasks: Task[] = [
        // Daily Tasks
        {
          id: 'daily-login',
          title: 'Daily Login Bonus',
          description: 'Log in to CharliesOdds every day',
          reward: 25,
          icon: <Calendar className="w-6 h-6" />,
          category: 'daily',
          completed: false,
          cooldown: 24
        },
        {
          id: 'daily-spin',
          title: 'Daily Wheel Spin',
          description: 'Spin the wheel once per day for free money',
          reward: 0, // Variable reward
          icon: <RotateCcw className="w-6 h-6" />,
          category: 'daily',
          completed: false,
          cooldown: 24
        },
        {
          id: 'daily-games',
          title: 'Play 10 Games',
          description: 'Play any 10 games across the platform',
          reward: 15,
          icon: <Play className="w-6 h-6" />,
          category: 'daily',
          completed: false,
          cooldown: 24
        },
        
        // Gaming Tasks
        {
          id: 'dice-master',
          title: 'Dice Master',
          description: 'Win 5 dice games in a row',
          reward: 50,
          icon: <Target className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        {
          id: 'crash-survivor',
          title: 'Crash Survivor',
          description: 'Cash out at 10x multiplier in Crash',
          reward: 75,
          icon: <Zap className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        {
          id: 'blackjack-pro',
          title: 'Blackjack Pro',
          description: 'Get 3 blackjacks in one session',
          reward: 40,
          icon: <Trophy className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        {
          id: 'plinko-lucky',
          title: 'Plinko Lucky',
          description: 'Hit a 1000x multiplier in Plinko',
          reward: 100,
          icon: <Star className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        {
          id: 'limbo-high',
          title: 'Limbo High Roller',
          description: 'Win with a 50x target multiplier',
          reward: 80,
          icon: <Award className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        {
          id: 'spin-winner',
          title: 'Spin Winner',
          description: 'Win 10 spins on the Spin Wheel',
          reward: 35,
          icon: <RotateCcw className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        {
          id: 'auto-bet-master',
          title: 'Auto-Bet Master',
          description: 'Run 100 auto-bets without going broke',
          reward: 60,
          icon: <Gamepad2 className="w-6 h-6" />,
          category: 'gaming',
          completed: false
        },
        
        // Social Tasks
        {
          id: 'profile-complete',
          title: 'Complete Your Profile',
          description: 'Fill out all profile information',
          reward: 20,
          icon: <Users className="w-6 h-6" />,
          category: 'social',
          completed: false
        },
        {
          id: 'suggestion-submit',
          title: 'Submit a Suggestion',
          description: 'Help improve the platform with feedback',
          reward: 30,
          icon: <Heart className="w-6 h-6" />,
          category: 'social',
          completed: false
        },
        {
          id: 'strategy-test',
          title: 'Strategy Tester',
          description: 'Test 3 different betting strategies',
          reward: 45,
          icon: <Target className="w-6 h-6" />,
          category: 'social',
          completed: false
        },
        
        // Special Tasks
        {
          id: 'first-week',
          title: 'First Week Milestone',
          description: 'Play for 7 consecutive days',
          reward: 150,
          icon: <Trophy className="w-6 h-6" />,
          category: 'special',
          completed: false
        },
        {
          id: 'big-winner',
          title: 'Big Winner',
          description: 'Win $500 in a single session',
          reward: 200,
          icon: <Coins className="w-6 h-6" />,
          category: 'special',
          completed: false
        },
        {
          id: 'analytics-viewer',
          title: 'Analytics Enthusiast',
          description: 'View your analytics page 5 times',
          reward: 25,
          icon: <Star className="w-6 h-6" />,
          category: 'special',
          completed: false
        },
        {
          id: 'settings-saver',
          title: 'Settings Saver',
          description: 'Save 3 different game configurations',
          reward: 35,
          icon: <Gift className="w-6 h-6" />,
          category: 'special',
          completed: false
        },
        {
          id: 'balance-manager',
          title: 'Balance Manager',
          description: 'Maintain positive balance for 24 hours',
          reward: 75,
          icon: <CheckCircle className="w-6 h-6" />,
          category: 'special',
          completed: false
        },
        {
          id: 'explorer',
          title: 'Platform Explorer',
          description: 'Visit all 6 games and 5 strategy pages',
          reward: 90,
          icon: <Zap className="w-6 h-6" />,
          category: 'special',
          completed: false
        },
        {
          id: 'community-helper',
          title: 'Community Helper',
          description: 'Vote on 10 community suggestions',
          reward: 40,
          icon: <Heart className="w-6 h-6" />,
          category: 'special',
          completed: false
        }
      ];
      
      setTasks(defaultTasks);
      localStorage.setItem('charlies-odds-tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const canSpin = () => {
    if (!lastSpin) return true;
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpin;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
    return timeSinceLastSpin >= cooldownTime;
  };

  const getTimeUntilNextSpin = () => {
    if (!lastSpin) return null;
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpin;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
    const timeRemaining = cooldownTime - timeSinceLastSpin;
    
    if (timeRemaining <= 0) return null;
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  const spinWheel = () => {
    if (!canSpin() || !user) return;

    setIsSpinning(true);
    
    // Generate random reward between $1-$50
    const rewards = [1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // Spin animation
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation + (spins * 360);
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSpinResult(randomReward);
      updateBalance(randomReward);
      setLastSpin(Date.now());
      localStorage.setItem('charlies-odds-last-spin', Date.now().toString());
      setIsSpinning(false);
    }, 3000);
  };

  const completeTask = (taskId: string) => {
    if (!user) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        updateBalance(task.reward);
        return {
          ...task,
          completed: true,
          lastCompleted: Date.now()
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('charlies-odds-tasks', JSON.stringify(updatedTasks));
  };

  const canCompleteTask = (task: Task) => {
    if (task.completed && task.cooldown) {
      if (!task.lastCompleted) return false;
      const now = Date.now();
      const timeSinceCompletion = now - task.lastCompleted;
      const cooldownTime = task.cooldown * 60 * 60 * 1000;
      return timeSinceCompletion >= cooldownTime;
    }
    return !task.completed;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'from-blue-500 to-cyan-500';
      case 'gaming': return 'from-green-500 to-emerald-500';
      case 'social': return 'from-purple-500 to-pink-500';
      case 'special': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const tasksByCategory = {
    daily: tasks.filter(task => task.category === 'daily'),
    gaming: tasks.filter(task => task.category === 'gaming'),
    social: tasks.filter(task => task.category === 'social'),
    special: tasks.filter(task => task.category === 'special')
  };

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Earn Free Balance
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete tasks, spin the wheel, and earn free balance to play with. 
            No real money required - just engage with the platform!
          </p>
          {user && (
            <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatCurrency(user.balance)}
              </div>
              <div className="text-gray-400">Current Balance</div>
            </div>
          )}
        </div>

        {/* Daily Wheel Spin */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-yellow-400 mr-3" />
              Daily Wheel Spin
            </h2>
            
            {/* Wheel */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="relative">
                <svg
                  width="200"
                  height="200"
                  className={`transition-transform duration-3000 ease-out`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Wheel segments */}
                  {[1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((amount, index) => {
                    const angle = (360 / 12) * index;
                    const nextAngle = (360 / 12) * (index + 1);
                    const startAngleRad = (angle * Math.PI) / 180;
                    const endAngleRad = (nextAngle * Math.PI) / 180;
                    
                    const x1 = 100 + 90 * Math.cos(startAngleRad);
                    const y1 = 100 + 90 * Math.sin(startAngleRad);
                    const x2 = 100 + 90 * Math.cos(endAngleRad);
                    const y2 = 100 + 90 * Math.sin(endAngleRad);
                    
                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 90 90 0 0 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
                    const color = colors[index % colors.length];
                    
                    return (
                      <g key={index}>
                        <path
                          d={pathData}
                          fill={color}
                          stroke="#1f2937"
                          strokeWidth="2"
                        />
                        <text
                          x={100 + 60 * Math.cos((startAngleRad + endAngleRad) / 2)}
                          y={100 + 60 * Math.sin((startAngleRad + endAngleRad) / 2)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          ${amount}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                </div>
              </div>
            </div>
            
            {/* Spin Button */}
            <div className="space-y-4">
              {canSpin() ? (
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || !user}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                >
                  {isSpinning ? 'Spinning...' : 'Spin for Free Money!'}
                </button>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-700 text-white py-4 px-8 rounded-xl">
                    Next spin available in: {getTimeUntilNextSpin()}
                  </div>
                </div>
              )}
              
              {spinResult && (
                <div className="bg-green-600 text-white p-4 rounded-xl">
                  🎉 You won ${spinResult}! 🎉
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks by Category */}
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 capitalize flex items-center">
              {category === 'daily' && <Clock className="w-6 h-6 mr-2 text-blue-400" />}
              {category === 'gaming' && <Gamepad2 className="w-6 h-6 mr-2 text-green-400" />}
              {category === 'social' && <Users className="w-6 h-6 mr-2 text-purple-400" />}
              {category === 'special' && <Star className="w-6 h-6 mr-2 text-yellow-400" />}
              {category} Tasks
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${
                    task.completed ? 'opacity-75' : 'hover:border-gray-600'
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(task.category)}`}>
                      <div className="text-white">
                        {task.icon}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {task.id === 'daily-spin' ? '$1-50' : `$${task.reward}`}
                      </div>
                      <div className="text-xs text-gray-400">Reward</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    {task.completed ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : canCompleteTask(task) ? (
                      <button
                        onClick={() => completeTask(task.id)}
                        disabled={!user}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Complete Task
                      </button>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        On cooldown
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
            CharliesOdds is a demo platform where you can learn and practice casino games without real money. 
            Complete tasks to earn virtual balance and explore all our features!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Daily Tasks</h3>
              <p className="text-gray-300 text-sm">Login bonuses and daily activities</p>
            </div>
            <div className="text-center">
              <Gamepad2 className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Gaming Challenges</h3>
              <p className="text-gray-300 text-sm">Achieve milestones in our games</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Community Tasks</h3>
              <p className="text-gray-300 text-sm">Engage with the platform features</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Special Rewards</h3>
              <p className="text-gray-300 text-sm">Unique achievements and bonuses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnBalance;