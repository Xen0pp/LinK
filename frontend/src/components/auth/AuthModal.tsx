import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  Alert,
  Box,
  Tab,
  Tabs,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab === 'login' ? 0 : 1);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loading, error } = useAuth();

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

  // Create dark theme for MUI components
  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#1d4ed8',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      background: {
        default: isDarkMode ? '#1f2937' : '#ffffff',
        paper: isDarkMode ? '#374151' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f9fafb' : '#111827',
        secondary: isDarkMode ? '#d1d5db' : '#6b7280',
      },
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setFormData({ email: '', password: '', displayName: '', confirmPassword: '' });
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 0) {
        // Login
        console.log('📧 Starting email sign-in...');
        await signInWithEmail(formData.email, formData.password);
        console.log('✅ Email sign-in completed, closing modal');
        onClose();
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        console.log('📧 Starting email sign-up...');
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
        console.log('✅ Email sign-up completed, closing modal');
        onClose();
      }
    } catch (error) {
      console.error('❌ Authentication error in modal:', error);
      // Error is already handled by the useAuth hook
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('🔍 Starting Google sign-in from modal...');
      await signInWithGoogle();
      console.log('✅ Google sign-in completed, closing modal');
      // Wait a moment to ensure state propagation
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('❌ Google sign-in error in modal:', error);
      // Error is already handled by the useAuth hook
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: isDarkMode 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.3)' : 'none',
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: isDarkMode 
              ? 'rgba(0, 0, 0, 0.8)' 
              : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }
        }}
      >
        <DialogTitle sx={{ position: 'relative', pb: 1, bgcolor: 'background.paper' }}>
          <Box className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">L</span>
              </div>
            </div>
            <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary">
              Welcome to LinK
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {activeTab === 0 
              ? 'Sign in to save your progress and access personalized features'
              : 'Create an account to track your learning journey'
            }
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, bgcolor: 'background.paper' }}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'divider', 
            mb: 3 
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                }
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 0 ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    bgcolor: isDarkMode ? 'rgba(220, 38, 38, 0.1)' : undefined,
                    color: isDarkMode ? '#fca5a5' : undefined,
                    border: isDarkMode ? '1px solid rgba(220, 38, 38, 0.3)' : undefined,
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {activeTab === 1 && (
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.displayName}
                    onChange={handleInputChange('displayName')}
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'background.default',
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : undefined,
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : undefined,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                      },
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'background.default',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : undefined,
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : undefined,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'background.default',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : undefined,
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : undefined,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                  }}
                />

                {activeTab === 1 && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'background.default',
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : undefined,
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : undefined,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                      },
                    }}
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&:disabled': {
                      bgcolor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : undefined,
                    }
                  }}
                >
                  {loading ? 'Please wait...' : activeTab === 0 ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <Divider sx={{ 
                my: 3,
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : undefined,
              }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignIn}
                disabled={loading}
                startIcon={
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">G</span>
                  </div>
                }
                sx={{ 
                  mb: 2,
                  py: 1.5,
                  borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : undefined,
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : undefined,
                    bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : undefined,
                  }
                }}
              >
                Continue with Google
              </Button>

              {activeTab === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => setActiveTab(1)}
                    sx={{ 
                      textTransform: 'none',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined,
                      }
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => setActiveTab(0)}
                    sx={{ 
                      textTransform: 'none',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined,
                      }
                    }}
                  >
                    Sign in
                  </Button>
                </Typography>
              )}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default AuthModal; 