import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon as TrophyIconSolid,
  FireIcon as FireIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { Card, CardContent, Typography, LinearProgress, Box, Chip } from '@mui/material';
import { useDeafStore } from '../../utils/deafStore';

const ProgressDashboard: React.FC = () => {
  const { 
    progress, 
    badges, 
    currentStreak, 
    totalSessionsCompleted,
    getTotalBadgesEarned,
    getAverageQuizScore,
    quizHistory 
  } = useDeafStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const calculateOverallProgress = () => {
    const totalCompleted = progress.flashcards.completed + 
                          progress.alphabet.completed + 
                          progress.commonSigns.completed;
    const totalItems = progress.flashcards.total + 
                      progress.alphabet.total + 
                      progress.commonSigns.total;
    
    return totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'primary';
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Overall Progress Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h5" className="font-bold mb-2">
                  Learning Progress
                </Typography>
                <Typography variant="h3" className="font-bold">
                  {calculateOverallProgress()}%
                </Typography>
              </div>
              <ChartBarIcon className="h-12 w-12 opacity-80" />
            </div>
            
            <LinearProgress 
              variant="determinate" 
              value={calculateOverallProgress()} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
            />
            
            <Typography variant="body2" className="mt-2 opacity-90">
              Keep going! You're doing great.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Streak */}
          <Card className="h-full">
            <CardContent className="text-center p-4">
              <div className="flex justify-center mb-2">
                {currentStreak > 0 ? (
                  <FireIconSolid className="h-8 w-8 text-orange-500" />
                ) : (
                  <FireIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <Typography variant="h4" className="font-bold text-orange-600">
                {currentStreak}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Day Streak
              </Typography>
            </CardContent>
          </Card>

          {/* Total Badges */}
          <Card className="h-full">
            <CardContent className="text-center p-4">
              <div className="flex justify-center mb-2">
                {getTotalBadgesEarned() > 0 ? (
                  <TrophyIconSolid className="h-8 w-8 text-yellow-500" />
                ) : (
                  <TrophyIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <Typography variant="h4" className="font-bold text-yellow-600">
                {getTotalBadgesEarned()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Badges Earned
              </Typography>
            </CardContent>
          </Card>

          {/* Sessions Completed */}
          <Card className="h-full">
            <CardContent className="text-center p-4">
              <div className="flex justify-center mb-2">
                <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
              </div>
              <Typography variant="h4" className="font-bold text-blue-600">
                {totalSessionsCompleted}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sessions
              </Typography>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="h-full">
            <CardContent className="text-center p-4">
              <div className="flex justify-center mb-2">
                <AcademicCapIcon className="h-8 w-8 text-green-500" />
              </div>
              <Typography variant="h4" className="font-bold text-green-600">
                {getAverageQuizScore()}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Avg. Score
              </Typography>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Category Progress */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Category Progress
            </Typography>
            
            <div className="space-y-4">
              {/* Flash Cards */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="body1" className="font-medium">
                    Flash Cards
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {progress.flashcards.completed} / {progress.flashcards.total}
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(progress.flashcards.completed / progress.flashcards.total) * 100}
                  color={getProgressBarColor((progress.flashcards.completed / progress.flashcards.total) * 100)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </div>

              {/* Alphabet */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="body1" className="font-medium">
                    Alphabet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {progress.alphabet.completed} / {progress.alphabet.total}
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(progress.alphabet.completed / progress.alphabet.total) * 100}
                  color={getProgressBarColor((progress.alphabet.completed / progress.alphabet.total) * 100)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </div>

              {/* Common Signs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="body1" className="font-medium">
                    Common Signs
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {progress.commonSigns.completed} / {progress.commonSigns.total}
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(progress.commonSigns.completed / progress.commonSigns.total) * 100}
                  color={getProgressBarColor((progress.commonSigns.completed / progress.commonSigns.total) * 100)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </div>

              {/* Dictionary Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="body1" className="font-medium">
                    Dictionary
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {progress.dictionary.searched} searches, {progress.dictionary.favorites.length} favorites
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <StarIconSolid className="h-4 w-4 text-yellow-500" />
                  <Typography variant="body2">
                    {progress.dictionary.favorites.length} signs favorited
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Achievements
            </Typography>
            
            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-medium mb-3 text-green-600">
                  Earned Badges ({earnedBadges.length})
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        icon={<span className="text-lg">{badge.icon}</span>}
                        label={badge.name}
                        variant="filled"
                        color="success"
                        sx={{
                          fontWeight: 'medium',
                          '& .MuiChip-icon': {
                            fontSize: '1.2rem'
                          }
                        }}
                        title={`${badge.description} - Earned ${
                          badge.earnedAt 
                            ? new Date(badge.earnedAt).toLocaleDateString() 
                            : 'Recently'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Badges */}
            {unearnedBadges.length > 0 && (
              <div>
                <Typography variant="subtitle1" className="font-medium mb-3 text-gray-600">
                  Available Badges ({unearnedBadges.length})
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {unearnedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Chip
                        icon={<span className="text-lg opacity-50">{badge.icon}</span>}
                        label={badge.name}
                        variant="outlined"
                        sx={{
                          opacity: 0.7,
                          '& .MuiChip-icon': {
                            fontSize: '1.2rem'
                          }
                        }}
                        title={badge.description}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      {quizHistory.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                Recent Quiz Results
              </Typography>
              
              <div className="space-y-3">
                {quizHistory.slice(-5).reverse().map((quiz, index) => (
                  <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <Typography variant="body2" className="font-medium capitalize">
                        {quiz.type.replace('-', ' ')} Quiz
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(quiz.completedAt).toLocaleDateString()}
                      </Typography>
                    </div>
                    
                    <div className="text-right">
                      <Typography 
                        variant="body1" 
                        className={`font-bold ${
                          (quiz.score / quiz.totalQuestions) >= 0.8 
                            ? 'text-green-600' 
                            : (quiz.score / quiz.totalQuestions) >= 0.6 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}
                      >
                        {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {quiz.score}/{quiz.totalQuestions}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressDashboard; 