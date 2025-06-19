import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import { useDeafStore } from '../../utils/deafStore';
import toast from 'react-hot-toast';

// SignImage component with error handling and fallback
const SignImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string; 
  fallbackText?: string;
}> = ({ src, alt, className = "", fallbackText = "Sign Image" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <HandRaisedIcon className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <Typography variant="body2" className="text-purple-800 dark:text-purple-200 font-medium">
            {fallbackText}
          </Typography>
          <Typography variant="caption" className="text-purple-600 dark:text-purple-400">
            {alt}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

// Sample flashcard data with proper image mapping
const flashcardsData = [
  { 
    id: 'hello', 
    word: 'Hello', 
    imageUrl: '/images/signs/flashcards/hello.jpg', 
    description: 'A friendly greeting',
    category: 'greetings'
  },
  { 
    id: 'thank-you', 
    word: 'Thank You', 
    imageUrl: '/images/signs/flashcards/thank-you.jpg', 
    description: 'Expression of gratitude',
    category: 'polite'
  },
  { 
    id: 'please', 
    word: 'Please', 
    imageUrl: '/images/signs/flashcards/please.webp', 
    description: 'Polite request',
    category: 'polite'
  },
  { 
    id: 'sorry', 
    word: 'Sorry', 
    imageUrl: '/images/signs/flashcards/sorry.jpg', 
    description: 'Apology or regret',
    category: 'emotions'
  },
  { 
    id: 'yes', 
    word: 'Yes', 
    imageUrl: '/images/signs/flashcards/yes.png', 
    description: 'Affirmative response',
    category: 'responses'
  },
  { 
    id: 'no', 
    word: 'No', 
    imageUrl: '/images/signs/flashcards/no.jpg', 
    description: 'Negative response',
    category: 'responses'
  },
  { 
    id: 'help', 
    word: 'Help', 
    imageUrl: '/images/signs/flashcards/help.png', 
    description: 'Request for assistance',
    category: 'actions'
  },
  { 
    id: 'water', 
    word: 'Water', 
    imageUrl: '/images/signs/flashcards/water.jpg', 
    description: 'The liquid we drink',
    category: 'food-drink'
  },
  { 
    id: 'food', 
    word: 'Food', 
    imageUrl: '/images/signs/flashcards/food.png', 
    description: 'Something to eat',
    category: 'food-drink'
  },
  { 
    id: 'home', 
    word: 'Home', 
    imageUrl: '/images/signs/flashcards/home.png', 
    description: 'Where you live',
    category: 'places'
  },
];

// Interface for FlashCard structure
interface FlashCard {
  id: string;
  word: string;
  imageUrl: string;
  description: string;
  category: string;
}

const FlashCards: React.FC = () => {
  const { updateProgress, addQuizResult, progress } = useDeafStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: boolean }>({});
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const currentCard = flashcardsData[currentCardIndex];

  // Generate quiz options for current card
  useEffect(() => {
    if (mode === 'quiz' && currentCard) {
      const otherWords = flashcardsData
        .filter(card => card.id !== currentCard.id)
        .map(card => card.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [currentCard.word, ...otherWords].sort(() => Math.random() - 0.5);
      setQuizOptions(options);
      setUserAnswer('');
    }
  }, [currentCardIndex, mode, currentCard]);

  const nextCard = () => {
    if (currentCardIndex < flashcardsData.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && mode === 'study') {
             setCompleted(prev => new Set([...Array.from(prev), currentCard.id]));
    }
  };

  const startQuiz = () => {
    setMode('quiz');
    setCurrentCardIndex(0);
    setQuizAnswers({});
    setQuizScore(0);
    setShowQuizResult(false);
    setIsFlipped(false);
    toast.success('Quiz started! Select the correct word for each sign.');
  };

  const handleQuizAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === currentCard.word;
    const newAnswers = { ...quizAnswers, [currentCard.id]: isCorrect };
    setQuizAnswers(newAnswers);
    setUserAnswer(selectedAnswer);

    if (isCorrect) {
      setQuizScore(quizScore + 1);
      toast.success('Correct!');
    } else {
      toast.error(`Incorrect. The answer was "${currentCard.word}"`);
    }

    // Auto advance after a delay
    setTimeout(() => {
      if (currentCardIndex < flashcardsData.length - 1) {
        nextCard();
      } else {
        finishQuiz(newAnswers);
      }
    }, 1500);
  };

  const finishQuiz = (answers: { [key: string]: boolean }) => {
    const finalScore = Object.values(answers).filter(Boolean).length;
    setShowQuizResult(true);
    
    // Update progress
    const newCompleted = Math.max(progress.flashcards.completed, Object.keys(answers).length);
    updateProgress('flashcards', { completed: newCompleted });

    // Add quiz result
    addQuizResult({
      id: `flashcards-${Date.now()}`,
      score: finalScore,
      totalQuestions: flashcardsData.length,
      completedAt: new Date(),
      type: 'flashcard'
    });

    toast.success(`Quiz completed! Score: ${finalScore}/${flashcardsData.length}`);
  };

  const resetToStudyMode = () => {
    setMode('study');
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowQuizResult(false);
    setUserAnswer('');
  };

  const progressPercentage = mode === 'study' 
    ? Math.round((completed.size / flashcardsData.length) * 100)
    : Math.round(((currentCardIndex + (userAnswer ? 1 : 0)) / flashcardsData.length) * 100);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            variant={mode === 'study' ? 'contained' : 'outlined'}
            onClick={resetToStudyMode}
            disabled={showQuizResult}
          >
            Study Mode
          </Button>
          <Button 
            variant={mode === 'quiz' ? 'contained' : 'outlined'}
            onClick={startQuiz}
            color="secondary"
          >
            Quiz Mode
          </Button>
        </div>

        <Chip 
          label={`${currentCardIndex + 1} / ${flashcardsData.length}`}
          color="primary"
          variant="outlined"
        />
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Typography variant="body2" color="textSecondary">
            {mode === 'study' ? 'Study Progress' : 'Quiz Progress'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {progressPercentage}%
          </Typography>
        </div>
        <LinearProgress 
          variant="determinate" 
          value={progressPercentage}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </div>

      {/* Quiz Results */}
      <AnimatePresence>
        {showQuizResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <CardContent className="text-center p-6">
                <Typography variant="h5" className="font-bold mb-2">
                  Quiz Complete!
                </Typography>
                <Typography variant="h3" className="font-bold mb-2">
                  {quizScore} / {flashcardsData.length}
                </Typography>
                <Typography variant="body1" className="opacity-90 mb-4">
                  Score: {Math.round((quizScore / flashcardsData.length) * 100)}%
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={resetToStudyMode}
                  sx={{ 
                    backgroundColor: 'white', 
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'grey.100' }
                  }}
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Study Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flashcard */}
      {!showQuizResult && (
        <motion.div
          className="flex justify-center"
          key={currentCardIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md aspect-square cursor-pointer" onClick={mode === 'study' ? flipCard : undefined}>
            <CardContent className="h-full flex flex-col items-center justify-center p-6 relative">
              {/* Study Mode */}
              {mode === 'study' && (
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      className="text-center w-full h-full flex flex-col items-center justify-center"
                    >
                      <SignImage 
                        src={currentCard.imageUrl}
                        alt={`Sign for ${currentCard.word}`}
                        className="w-full h-48 mb-4"
                        fallbackText="Sign Image"
                      />
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        Click to reveal the word
                      </Typography>
                      <Button variant="outlined" size="small">
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Flip Card
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      className="text-center w-full h-full flex flex-col items-center justify-center"
                    >
                      <Typography variant="h3" className="font-bold text-purple-600 mb-4">
                        {currentCard.word}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" className="mb-4">
                        {currentCard.description}
                      </Typography>
                      {completed.has(currentCard.id) && (
                        <Chip 
                          icon={<CheckIcon className="h-4 w-4" />}
                          label="Completed"
                          color="success"
                          size="small"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Quiz Mode */}
              {mode === 'quiz' && (
                <div className="text-center w-full h-full flex flex-col items-center justify-center space-y-4">
                  <SignImage 
                    src={currentCard.imageUrl}
                    alt={`Sign for ${currentCard.word}`}
                    className="w-full h-48 mb-4"
                    fallbackText={`Sign for "${currentCard.word}"`}
                  />
                  
                  <Typography variant="h6" className="mb-4">
                    What is this sign?
                  </Typography>

                  <div className="grid grid-cols-2 gap-2 w-full">
                    {quizOptions.map((option) => (
                      <Button
                        key={option}
                        variant={userAnswer === option ? 
                          (option === currentCard.word ? "contained" : "contained") : 
                          "outlined"
                        }
                        color={userAnswer === option ? 
                          (option === currentCard.word ? "success" : "error") : 
                          "primary"
                        }
                        onClick={() => handleQuizAnswer(option)}
                        disabled={!!userAnswer}
                        className="h-12"
                      >
                        {option}
                        {userAnswer === option && (
                          option === currentCard.word ? 
                            <CheckIcon className="h-4 w-4 ml-2" /> : 
                            <XMarkIcon className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      {!showQuizResult && mode === 'study' && (
        <div className="flex justify-between items-center">
          <Button
            variant="outlined"
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            startIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Previous
          </Button>

          <Typography variant="body2" color="textSecondary">
            {completed.size} of {flashcardsData.length} completed
          </Typography>

          <Button
            variant="outlined"
            onClick={nextCard}
            disabled={currentCardIndex === flashcardsData.length - 1}
            endIcon={<ArrowRightIcon className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashCards; 