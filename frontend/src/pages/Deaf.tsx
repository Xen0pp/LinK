import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  HandRaisedIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useDeafStore } from '../utils/deafStore';
import FlashCards from '../components/deaf/FlashCards';
import Alphabet from '../components/deaf/Alphabet';
import CommonSigns from '../components/deaf/CommonSigns';
import Dictionary from '../components/deaf/Dictionary';
import ProgressDashboard from '../components/deaf/ProgressDashboard';

const Deaf: React.FC = () => {
  const { currentTab, setCurrentTab, getTotalBadgesEarned, currentStreak } = useDeafStore();
  const [tabValue, setTabValue] = useState(0);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: ChartBarIcon,
      component: ProgressDashboard,
      description: 'Track your learning progress and achievements'
    },
    {
      id: 'flashcards',
      label: 'Flash Cards',
      icon: AcademicCapIcon,
      component: FlashCards,
      description: 'Interactive sign language flash cards and quizzes'
    },
    {
      id: 'alphabet',
      label: 'Alphabet',
      icon: BookOpenIcon,
      component: Alphabet,
      description: 'Learn the sign language alphabet A-Z'
    },
    {
      id: 'common-signs',
      label: 'Common Signs',
      icon: HandRaisedIcon,
      component: CommonSigns,
      description: 'Essential everyday sign language vocabulary'
    },
    {
      id: 'dictionary',
      label: 'Dictionary',
      icon: MagnifyingGlassIcon,
      component: Dictionary,
      description: 'Search and explore sign language dictionary'
    }
  ];

  useEffect(() => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentTabIndex !== -1) {
      setTabValue(currentTabIndex);
    }
  }, [currentTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setCurrentTab(tabs[newValue].id);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-purple-600 dark:text-purple-400">Sign Language</span> Learning
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Master sign language through interactive lessons, quizzes, and practice sessions. 
              Track your progress and earn badges as you learn.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full">
                <TrophyIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-purple-800 dark:text-purple-200">
                  {getTotalBadgesEarned()} Badges Earned
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full">
                <FireIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="font-semibold text-orange-800 dark:text-orange-200">
                  {currentStreak} Day Streak
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Tabs Navigation */}
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'transparent'
          }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                },
              }}
              aria-label="Sign language learning sections"
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <Tab
                    key={tab.id}
                    icon={<Icon className="h-5 w-5" />}
                    label={tab.label}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 1,
                      alignItems: 'center',
                    }}
                    aria-label={`${tab.label} - ${tab.description}`}
                  />
                );
              })}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tabValue}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tab Description */}
                <div className="mb-6">
                  <Typography
                    variant="body1"
                    className="text-gray-600 dark:text-gray-300"
                    sx={{ mb: 2 }}
                  >
                    {tabs[tabValue].description}
                  </Typography>
                </div>

                {/* Tab Component */}
                {React.createElement(tabs[tabValue].component)}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
          aria-label="Help and tips"
          onClick={() => {
            // Could open a help modal or tour
            console.log('Help clicked');
          }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default Deaf; 