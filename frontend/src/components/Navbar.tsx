import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ChatBubbleLeftRightIcon, 
  InformationCircleIcon,
  SunIcon,
  MoonIcon,
  HandRaisedIcon,
  EyeIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Button, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';
import { useDeafStore } from '../utils/deafStore';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { badges, currentStreak, getTotalBadgesEarned, getAverageQuizScore } = useDeafStore();

  // Debug logging for authentication state
  React.useEffect(() => {
    console.log('🔐 Navbar Auth State:', {
      hasUser: !!user,
      hasProfile: !!userProfile,
      userEmail: user?.email,
      profileDisplayName: userProfile?.displayName
    });
  }, [user, userProfile]);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Tools', href: '/tools', icon: WrenchScrewdriverIcon },
    { name: 'Chat Assistant', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Deaf Learning', href: '/deaf', icon: HandRaisedIcon },
    { name: 'Blind Accessibility', href: '/blind', icon: EyeIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const isCurrentPage = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      <nav 
        className="bg-primary border-primary shadow-lg"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand - LEFT SIDE */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-3 text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-3 py-2"
                aria-label="LinK - Go to homepage"
              >
                {/* Enhanced Logo Icon */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                  <HandRaisedIcon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                {/* Website Name */}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold text-2xl tracking-tight">
                  LinK
                </span>
              </Link>
            </div>

            {/* Desktop navigation - CENTER AND RIGHT */}
            <div className="hidden md:flex items-center space-x-1 flex-1 justify-end">
              {navigation.map((item) => {
                const Icon = item.icon;
                const current = isCurrentPage(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      current
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    aria-current={current ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
              
              {/* Authentication Section */}
              {user && userProfile ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleUserMenuOpen}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="User menu"
                  >
                    <Avatar
                      src={userProfile.photoURL}
                      sx={{ width: 32, height: 32 }}
                    >
                      {userProfile.displayName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300 hidden lg:block">
                      {userProfile.displayName.split(' ')[0]}
                    </Typography>
                  </button>
                </div>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setAuthModalOpen(true)}
                  className="ml-2"
                  startIcon={<UserIcon className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-secondary hover:bg-tertiary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const current = isCurrentPage(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMenu}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        current
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      aria-current={current ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Mobile Authentication */}
                <Divider className="my-2" />
                {user && userProfile ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar
                        src={userProfile.photoURL}
                        sx={{ width: 40, height: 40 }}
                      >
                        {userProfile.displayName.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography variant="body2" fontWeight="bold" className="text-gray-900 dark:text-white">
                          {userProfile.displayName}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                          {userProfile.email}
                        </Typography>
                      </div>
                    </div>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleLogout}
                      startIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                      className="mb-2"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setAuthModalOpen(true);
                        closeMenu();
                      }}
                      startIcon={<UserIcon className="h-4 w-4" />}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1.5 }}
      >
        <div className="px-4 py-3 border-b min-w-[280px]">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar
              src={userProfile?.photoURL}
              sx={{ width: 48, height: 48 }}
            >
              {userProfile?.displayName.charAt(0)}
            </Avatar>
            <div>
              <Typography variant="body1" fontWeight="bold">
                {userProfile?.displayName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {userProfile?.email}
              </Typography>
            </div>
          </div>
          
          {/* Quick Stats - Instagram Style */}
          <div className="grid grid-cols-3 gap-4 py-2">
            <div className="text-center">
              <Typography variant="h6" fontWeight="bold" className="text-yellow-600">
                {getTotalBadgesEarned()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Badges
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" fontWeight="bold" className="text-orange-600">
                {currentStreak}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Streak
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" fontWeight="bold" className="text-green-600">
                {getAverageQuizScore()}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Avg Score
              </Typography>
            </div>
          </div>
        </div>
        
        <MenuItem onClick={handleUserMenuClose} component={Link} to="/profile">
          <UserIcon className="h-4 w-4 mr-2" />
          View Profile
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <CogIcon className="h-4 w-4 mr-2" />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
          Sign Out
        </MenuItem>
      </Menu>

      {/* Authentication Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 