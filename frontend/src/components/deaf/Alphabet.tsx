import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  HandRaisedIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import { useDeafStore } from '../../utils/deafStore';
import toast from 'react-hot-toast';

// ASL Alphabet data with descriptions
const alphabetData = [
  { letter: 'A', description: 'Make a fist with thumb on the side', difficulty: 'easy' },
  { letter: 'B', description: 'Flat hand with thumb tucked in', difficulty: 'easy' },
  { letter: 'C', description: 'Curved hand like holding a cup', difficulty: 'easy' },
  { letter: 'D', description: 'Index finger up, other fingers touch thumb', difficulty: 'easy' },
  { letter: 'E', description: 'All fingertips touch thumb', difficulty: 'medium' },
  { letter: 'F', description: 'Index and thumb touch, others extended', difficulty: 'medium' },
  { letter: 'G', description: 'Index finger and thumb pointing sideways', difficulty: 'medium' },
  { letter: 'H', description: 'Index and middle finger extended sideways', difficulty: 'easy' },
  { letter: 'I', description: 'Pinky finger extended up', difficulty: 'easy' },
  { letter: 'J', description: 'Pinky extended, draw a J in the air', difficulty: 'hard' },
  { letter: 'K', description: 'Index and middle finger up, thumb between', difficulty: 'medium' },
  { letter: 'L', description: 'Index finger up, thumb out (L shape)', difficulty: 'easy' },
  { letter: 'M', description: 'Three fingers over thumb', difficulty: 'medium' },
  { letter: 'N', description: 'Two fingers over thumb', difficulty: 'medium' },
  { letter: 'O', description: 'All fingers curved into O shape', difficulty: 'easy' },
  { letter: 'P', description: 'Like K but pointing down', difficulty: 'medium' },
  { letter: 'Q', description: 'Index finger and thumb down', difficulty: 'medium' },
  { letter: 'R', description: 'Index and middle finger crossed', difficulty: 'medium' },
  { letter: 'S', description: 'Make a fist with thumb over fingers', difficulty: 'easy' },
  { letter: 'T', description: 'Thumb between index and middle finger', difficulty: 'medium' },
  { letter: 'U', description: 'Index and middle finger up together', difficulty: 'easy' },
  { letter: 'V', description: 'Index and middle finger apart (victory)', difficulty: 'easy' },
  { letter: 'W', description: 'Index, middle, and ring finger up', difficulty: 'medium' },
  { letter: 'X', description: 'Index finger curved like a hook', difficulty: 'medium' },
  { letter: 'Y', description: 'Thumb and pinky extended (hang loose)', difficulty: 'easy' },
  { letter: 'Z', description: 'Index finger traces Z in the air', difficulty: 'hard' }
];

// SignImage component for alphabet letters
const AlphabetSignImage: React.FC<{ 
  letter: string; 
  className?: string; 
}> = ({ letter, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = `/images/signs/alphabet/${letter.toLowerCase()}.png`;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <HandRaisedIcon className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <Typography variant="h3" className="font-bold text-blue-800 dark:text-blue-200 mb-2">
            {letter}
          </Typography>
          <Typography variant="caption" className="text-blue-600 dark:text-blue-400">
            ASL Sign
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={`ASL sign for letter ${letter}`}
        className={`w-full h-full object-contain rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

const Alphabet: React.FC = () => {
  const { updateProgress, progress } = useDeafStore();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mode, setMode] = useState<'learn' | 'practice' | 'quiz'>('learn');
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showDescription, setShowDescription] = useState(true);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: boolean }>({});

  const currentLetter = alphabetData[currentLetterIndex];

  // Text-to-speech function
  const speakLetter = (letter: string, description: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Letter ${letter}. ${description}`);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const nextLetter = () => {
    if (currentLetterIndex < alphabetData.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setShowDescription(true);
    }
  };

  const previousLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
      setShowDescription(true);
    }
  };

  const markAsLearned = () => {
    const newCompleted = new Set([...Array.from(completed), currentLetter.letter]);
    setCompleted(newCompleted);
    
    // Update progress in store
    const newProgress = Math.max(progress.alphabet.completed, newCompleted.size);
    updateProgress('alphabet', { completed: newProgress });
    
    toast.success(`Letter ${currentLetter.letter} learned!`);
    
    // Auto advance to next letter
    setTimeout(() => {
      if (currentLetterIndex < alphabetData.length - 1) {
        nextLetter();
      }
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const progressPercentage = Math.round((completed.size / alphabetData.length) * 100);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex space-x-2">
          <Button 
            variant={mode === 'learn' ? 'contained' : 'outlined'}
            onClick={() => setMode('learn')}
            startIcon={<AcademicCapIcon className="h-4 w-4" />}
          >
            Learn
          </Button>
          <Button 
            variant={mode === 'practice' ? 'contained' : 'outlined'}
            onClick={() => setMode('practice')}
            startIcon={<HandRaisedIcon className="h-4 w-4" />}
            color="secondary"
          >
            Practice
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Chip 
            label={`${currentLetterIndex + 1} / ${alphabetData.length}`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            label={currentLetter.difficulty}
            color={getDifficultyColor(currentLetter.difficulty) as any}
            size="small"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Typography variant="body2" color="textSecondary">
            Alphabet Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {completed.size} / {alphabetData.length} learned ({progressPercentage}%)
          </Typography>
        </div>
        <LinearProgress 
          variant="determinate" 
          value={progressPercentage}
          sx={{ height: 8, borderRadius: 4 }}
          color={progressPercentage === 100 ? 'success' : 'primary'}
        />
      </div>

      {/* Learning Mode */}
      {mode === 'learn' && (
        <motion.div
          key={currentLetterIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Letter Display */}
                <div className="space-y-4">
                  <Typography variant="h2" className="font-bold text-blue-600 dark:text-blue-400">
                    {currentLetter.letter}
                  </Typography>
                  
                  {/* Sign Image */}
                  <AlphabetSignImage 
                    letter={currentLetter.letter}
                    className="w-64 h-64 mx-auto"
                  />
                  
                  {/* Audio Button */}
                  <Button
                    variant="outlined"
                    onClick={() => speakLetter(currentLetter.letter, currentLetter.description)}
                    startIcon={<SpeakerWaveIcon className="h-4 w-4" />}
                    className="mb-4"
                  >
                    Hear Description
                  </Button>
                </div>

                {/* Description */}
                <AnimatePresence>
                  {showDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                    >
                      <Typography variant="h6" className="text-blue-800 dark:text-blue-200 mb-2">
                        How to sign "{currentLetter.letter}":
                      </Typography>
                      <Typography variant="body1" className="text-blue-700 dark:text-blue-300">
                        {currentLetter.description}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outlined"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    {showDescription ? 'Hide' : 'Show'} Description
                  </Button>
                  
                  {!completed.has(currentLetter.letter) && (
                    <Button
                      variant="contained"
                      onClick={markAsLearned}
                      startIcon={<CheckIcon className="h-4 w-4" />}
                      color="success"
                    >
                      Mark as Learned
                    </Button>
                  )}
                  
                  {completed.has(currentLetter.letter) && (
                    <Chip 
                      icon={<CheckIcon className="h-4 w-4" />}
                      label="Learned"
                      color="success"
                      variant="filled"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Practice Mode - Grid View */}
      {mode === 'practice' && (
        <div className="space-y-6">
          <Typography variant="h5" className="text-center font-semibold">
            ASL Alphabet Practice
          </Typography>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {alphabetData.map((letterData, index) => (
              <motion.div
                key={letterData.letter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    completed.has(letterData.letter) 
                      ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => {
                    setCurrentLetterIndex(index);
                    setMode('learn');
                  }}
                >
                  <CardContent className="p-4 text-center space-y-2">
                    <AlphabetSignImage 
                      letter={letterData.letter}
                      className="w-20 h-20 mx-auto"
                    />
                    <Typography variant="h6" className="font-bold">
                      {letterData.letter}
                    </Typography>
                    <Chip 
                      label={letterData.difficulty}
                      color={getDifficultyColor(letterData.difficulty) as any}
                      size="small"
                    />
                    {completed.has(letterData.letter) && (
                      <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation (Learn Mode) */}
      {mode === 'learn' && (
        <div className="flex justify-between items-center">
          <Button
            variant="outlined"
            onClick={previousLetter}
            disabled={currentLetterIndex === 0}
            startIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Previous
          </Button>

          <Typography variant="body2" color="textSecondary" className="text-center">
            {completed.size} letters learned
          </Typography>

          <Button
            variant="outlined"
            onClick={nextLetter}
            disabled={currentLetterIndex === alphabetData.length - 1}
            endIcon={<ArrowRightIcon className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      )}

      {/* Completion Celebration */}
      {completed.size === alphabetData.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg"
        >
          <Typography variant="h4" className="font-bold mb-2">
            🎉 Congratulations!
          </Typography>
          <Typography variant="h6" className="mb-4">
            You've learned the complete ASL alphabet!
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setCompleted(new Set());
              setCurrentLetterIndex(0);
              setMode('practice');
            }}
            sx={{ 
              backgroundColor: 'white', 
              color: 'primary.main',
              '&:hover': { backgroundColor: 'grey.100' }
            }}
          >
            Practice Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Alphabet; 