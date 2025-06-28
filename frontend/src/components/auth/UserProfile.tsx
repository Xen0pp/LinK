import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import {
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useDeafStore } from '../../utils/deafStore';
import { addSampleProgress } from '../../utils/sampleData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserProfile: React.FC = () => {
  const { user, userProfile, logout, updateUserPreferences } = useAuth();
  const { badges, progress, quizHistory } = useDeafStore();
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Colors for charts
  const chartColors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6', 
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  };

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <Typography variant="h6" color="textSecondary">
            Please sign in to view your profile
          </Typography>
        </div>
      </div>
    );
  }

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalProgress = Object.values(progress).reduce((total, category) => {
    if ('completed' in category && 'total' in category) {
      return total + (category.completed / category.total) * 100;
    }
    return total;
  }, 0) / 3; // Average of 3 main categories

  const recentQuizzes = quizHistory
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  // Generate mock activity data for the last 7 days
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      quizzes: Math.floor(Math.random() * 5) + (i < 3 ? 0 : 1),
      studyTime: Math.floor(Math.random() * 60) + 15,
      accuracy: Math.floor(Math.random() * 20) + 75
    };
  });

  // Progress distribution data
  const progressData = [
    { 
      name: 'Flashcards', 
      completed: progress.flashcards.completed,
      total: progress.flashcards.total,
      percentage: (progress.flashcards.completed / progress.flashcards.total) * 100,
      color: chartColors.primary
    },
    { 
      name: 'Alphabet', 
      completed: progress.alphabet.completed,
      total: progress.alphabet.total,
      percentage: (progress.alphabet.completed / progress.alphabet.total) * 100,
      color: chartColors.secondary
    },
    { 
      name: 'Common Signs', 
      completed: progress.commonSigns.completed,
      total: progress.commonSigns.total,
      percentage: (progress.commonSigns.completed / progress.commonSigns.total) * 100,
      color: chartColors.success
    }
  ];

  // Skill levels data for radar chart
  const skillData = [
    { skill: 'Vocabulary', value: (progress.dictionary.searched || 0) > 20 ? 90 : 60 },
    { skill: 'Alphabet', value: (progress.alphabet.completed / progress.alphabet.total) * 100 },
    { skill: 'Grammar', value: 75 },
    { skill: 'Fluency', value: totalProgress },
    { skill: 'Comprehension', value: userProfile.statistics.averageScore },
    { skill: 'Expression', value: earnedBadges.length * 15 }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePreferenceChange = (preference: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateUserPreferences({
      [preference]: event.target.checked
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar
                    src={userProfile.photoURL}
                    sx={{ width: 120, height: 120 }}
                    className="shadow-lg border-4 border-white/50"
                  >
                    <span className="text-4xl font-bold">{userProfile.displayName.charAt(0)}</span>
                  </Avatar>
                </motion.div>
                
                <div className="flex-1 text-center md:text-left">
                  <Typography variant="h3" fontWeight="bold" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {userProfile.displayName}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" className="mb-1">
                    {userProfile.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="flex items-center justify-center md:justify-start">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Member since {formatDate(userProfile.createdAt)}
                  </Typography>
                  
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrophyIcon className="h-6 w-6 text-white" />
                      </div>
                      <Typography variant="h4" fontWeight="bold" className="text-yellow-600">
                        {earnedBadges.length}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Achievements
                      </Typography>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FireIcon className="h-6 w-6 text-white" />
                      </div>
                      <Typography variant="h4" fontWeight="bold" className="text-orange-600">
                        {userProfile.statistics.currentStreak}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Day Streak
                      </Typography>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ChartBarIcon className="h-6 w-6 text-white" />
                      </div>
                      <Typography variant="h4" fontWeight="bold" className="text-green-600">
                        {userProfile.statistics.averageScore}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Avg Score
                      </Typography>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <AcademicCapIcon className="h-6 w-6 text-white" />
                      </div>
                      <Typography variant="h4" fontWeight="bold" className="text-blue-600">
                        {userProfile.statistics.totalQuizzes}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Quizzes
                      </Typography>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={addSampleProgress}
                    sx={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    📊 Add Demo Data
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CogIcon className="h-4 w-4" />}
                    onClick={() => setShowSettings(true)}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
              
              {/* Overall Progress Bar */}
              <Box className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="h6" fontWeight="bold" className="text-blue-700 dark:text-blue-300">
                    Overall Learning Progress
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" className="text-blue-700 dark:text-blue-300">
                    {Math.round(totalProgress)}%
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={totalProgress}
                  sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      borderRadius: 6
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabbed Content Area */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="📊 Analytics" />
              <Tab label="🏆 Achievements" />
              <Tab label="📈 Progress" />
              <Tab label="🎯 Activity" />
            </Tabs>
          </Box>

          {/* Analytics Tab */}
          <TabPanel value={activeTab} index={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Weekly Activity Chart */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <Typography variant="h6" fontWeight="bold" className="mb-4">
                  📅 Weekly Activity Overview
                </Typography>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorStudyTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="quizzes" stroke={chartColors.primary} fillOpacity={1} fill="url(#colorQuizzes)" />
                      <Area type="monotone" dataKey="studyTime" stroke={chartColors.secondary} fillOpacity={1} fill="url(#colorStudyTime)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress Distribution */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <Typography variant="h6" fontWeight="bold" className="mb-4">
                  📊 Progress Distribution
                </Typography>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="completed"
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value}/${props.payload.total} (${Math.round(props.payload.percentage)}%)`,
                          props.payload.name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quiz Performance Trend */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <Typography variant="h6" fontWeight="bold" className="mb-4">
                  📈 Quiz Performance Trend
                </Typography>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={recentQuizzes.reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis 
                        dataKey="completedAt" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                        formatter={(value: any, name: string) => [
                          `${Math.round((value / 10) * 100)}%`, 
                          'Score'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke={chartColors.success}
                        strokeWidth={3}
                        dot={{ fill: chartColors.success, strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: chartColors.success }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Achievements Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" fontWeight="bold" className="mb-6">
              🏆 Your Achievements & Badges
            </Typography>
            
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div className="col-span-1 md:col-span-1 lg:col-span-1">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`h-full ${
                          badge.earned 
                            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <CardContent className="text-center p-6">
                          <div className={`text-6xl mb-3 ${badge.earned ? '' : 'grayscale'}`}>
                            {badge.icon}
                          </div>
                          <Typography variant="h6" fontWeight="bold" className={badge.earned ? 'text-yellow-700' : 'text-gray-500'}>
                            {badge.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="mt-2">
                            {badge.description}
                          </Typography>
                          {badge.earned && (
                            <Chip 
                              label="Earned!" 
                              color="success" 
                              size="small" 
                              className="mt-3"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : (
              <Box className="text-center py-12">
                <TrophyIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <Typography variant="h6" color="textSecondary">
                  No achievements yet
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-4">
                  Complete quizzes and learning activities to earn badges!
                </Typography>
                <Button variant="contained" href="/deaf">
                  Start Learning
                </Button>
              </Box>
            )}
          </TabPanel>

          {/* Progress Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" fontWeight="bold" className="mb-6">
              📈 Detailed Learning Progress
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress Bars */}
              <div className="col-span-1 md:col-span-2">
                <div className="space-y-6">
                  {progressData.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <Typography variant="h6" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" style={{ color: item.color }}>
                            {item.completed}/{item.total} ({Math.round(item.percentage)}%)
                          </Typography>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: `${item.color}20`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: item.color,
                              borderRadius: 6
                            }
                          }}
                        />
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Radial Progress */}
              <div className="col-span-1 md:col-span-2">
                <Card className="p-4 h-full">
                  <Typography variant="h6" fontWeight="bold" className="mb-4 text-center">
                    🎯 Skill Levels
                  </Typography>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={skillData}>
                        <RadialBar dataKey="value" cornerRadius={10} fill={chartColors.primary} />
                        <Tooltip formatter={(value) => [`${Math.round(Number(value))}%`, 'Proficiency']} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>

          {/* Activity Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" fontWeight="bold" className="mb-6">
              🎯 Recent Activity & Timeline
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Quiz Results */}
              <div className="col-span-1 md:col-span-2">
                <Card className="p-4 h-full">
                  <Typography variant="h6" fontWeight="bold" className="mb-4">
                    📝 Recent Quiz Results
                  </Typography>
                  
                  {recentQuizzes.length > 0 ? (
                    <div className="space-y-3">
                      {recentQuizzes.map((quiz, index) => (
                        <motion.div
                          key={quiz.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <AcademicCapIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <Typography variant="body1" fontWeight="medium" className="capitalize">
                                {quiz.type.replace('-', ' ')}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatDate(quiz.completedAt)}
                              </Typography>
                            </div>
                          </div>
                          <div className="text-right">
                            <Typography variant="h6" fontWeight="bold" className="text-green-600">
                              {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {quiz.score}/{quiz.totalQuestions}
                            </Typography>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Box className="text-center py-8">
                      <ClockIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <Typography variant="body1" color="textSecondary">
                        No quiz history yet
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Start taking quizzes to see your progress!
                      </Typography>
                    </Box>
                  )}
                </Card>
              </div>

              {/* Study Statistics */}
              <div className="col-span-1 md:col-span-2">
                <Card className="p-4 h-full">
                  <Typography variant="h6" fontWeight="bold" className="mb-4">
                    📊 Study Statistics
                  </Typography>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <ClockIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <Typography variant="h4" fontWeight="bold" className="text-green-600">
                        {userProfile.statistics.totalStudyTime || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Minutes Studied
                      </Typography>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <StarIcon className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <Typography variant="h4" fontWeight="bold" className="text-purple-600">
                        {userProfile.statistics.bestStreak || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Best Streak
                      </Typography>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <ChartBarIcon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <Typography variant="h4" fontWeight="bold" className="text-blue-600">
                        {Math.round(totalProgress)}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Overall Progress
                      </Typography>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <TrophyIcon className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                      <Typography variant="h4" fontWeight="bold" className="text-orange-600">
                        {earnedBadges.length}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Achievements
                      </Typography>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>
        </Card>

        {/* Settings Dialog */}
        <Dialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold" className="flex items-center">
              <CogIcon className="h-6 w-6 mr-2" />
              Accessibility Preferences
            </Typography>
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={userProfile.preferences.highContrast}
                    onChange={handlePreferenceChange('highContrast')}
                  />
                }
                label="High Contrast Mode"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userProfile.preferences.largeText}
                    onChange={handlePreferenceChange('largeText')}
                  />
                }
                label="Large Text"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userProfile.preferences.reducedMotion}
                    onChange={handlePreferenceChange('reducedMotion')}
                  />
                }
                label="Reduced Motion"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userProfile.preferences.screenReaderMode}
                    onChange={handlePreferenceChange('screenReaderMode')}
                  />
                }
                label="Screen Reader Mode"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userProfile.preferences.keyboardNavigation}
                    onChange={handlePreferenceChange('keyboardNavigation')}
                  />
                }
                label="Enhanced Keyboard Navigation"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile; 