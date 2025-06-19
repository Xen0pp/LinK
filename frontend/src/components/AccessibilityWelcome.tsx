import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';
import { SpeakerWaveIcon, EyeSlashIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface AccessibilityWelcomeProps {
  onModeSelect: (mode: 'deaf' | 'blind' | null) => void;
}

const AccessibilityWelcome: React.FC<AccessibilityWelcomeProps> = ({ onModeSelect }) => {
  const [open, setOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if this is the first visit or user hasn't selected a mode
    const hasSeenWelcome = localStorage.getItem('link-accessibility-welcome');
    const savedMode = localStorage.getItem('link-accessibility-mode');
    
    if (!hasSeenWelcome && !hasShown) {
      setOpen(true);
      setHasShown(true);
      
      // Speak welcome message
      const welcomeMessage = "Welcome to LinK! I'm your accessibility assistant. I can help you navigate this website. Would you like to use voice control for blind accessibility, or continue with visual features for deaf accessibility? Press B for blind mode, or D for deaf mode.";
      speakText(welcomeMessage);
    } else if (savedMode) {
      onModeSelect(savedMode as 'deaf' | 'blind');
    }
  }, [hasShown, onModeSelect]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleModeSelect = (mode: 'deaf' | 'blind') => {
    localStorage.setItem('link-accessibility-welcome', 'true');
    localStorage.setItem('link-accessibility-mode', mode);
    setOpen(false);
    onModeSelect(mode);
    
    if (mode === 'blind') {
      speakText("Blind mode activated. Voice control is now enabled. You can say commands like 'go to home', 'go to tools', 'go to chat', or 'sign in'. I'll wait for your voice commands.");
    } else {
      speakText("Deaf mode activated. Visual interface is optimized for you.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'b') {
      handleModeSelect('blind');
    } else if (event.key.toLowerCase() === 'd') {
      handleModeSelect('deaf');
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onKeyDown={handleKeyPress}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2
        }
      }}
    >
      <DialogTitle>
        <Box textAlign="center" mb={2}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <HandRaisedIcon className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to LinK
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Your bridge to inclusive learning and communication
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="h6" gutterBottom className="text-center mb-4">
          How would you like to experience LinK today?
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleModeSelect('blind')}
              className="p-6 h-auto flex-col space-y-3 border-2 hover:border-blue-500"
              sx={{ textTransform: 'none' }}
            >
              <EyeSlashIcon className="h-12 w-12 text-blue-600" />
              <Typography variant="h6" fontWeight="bold">
                Voice Control (B)
              </Typography>
              <Typography variant="body2" color="textSecondary" textAlign="center">
                Navigate hands-free with voice commands. Perfect for blind users or those who prefer audio interaction.
              </Typography>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleModeSelect('deaf')}
              className="p-6 h-auto flex-col space-y-3 border-2 hover:border-green-500"
              sx={{ textTransform: 'none' }}
            >
              <HandRaisedIcon className="h-12 w-12 text-green-600" />
              <Typography variant="h6" fontWeight="bold">
                Visual Interface (D)
              </Typography>
              <Typography variant="body2" color="textSecondary" textAlign="center">
                Enhanced visual experience with sign language learning tools and visual feedback.
              </Typography>
            </Button>
          </motion.div>
        </div>
        
        <Box mt={4} textAlign="center">
          <Typography variant="caption" color="textSecondary">
            Use keyboard: Press <strong>B</strong> for Voice Control or <strong>D</strong> for Visual Interface
          </Typography>
          <br />
          <Typography variant="caption" color="textSecondary">
            You can change this setting anytime in your profile.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityWelcome; 