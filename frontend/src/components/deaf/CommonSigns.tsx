import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  SpeakerWaveIcon,
  HeartIcon,
  InformationCircleIcon,
  XMarkIcon,
  HandRaisedIcon,
  BookmarkIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  AcademicCapIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';
import { 
  TextField, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Divider,
  Tooltip,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import toast from 'react-hot-toast';

// Helper function to convert string to title case
const toTitleCase = (str: string): string => {
  return str.replace(/[_-]/g, ' ').replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Type definitions
interface SignData {
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  usage: string;
}

interface CommonSignsDataType {
  [category: string]: {
    [word: string]: SignData;
  };
}

// Common Signs Data Structure - Real ASL Photographs from Cropped Charts
const commonSignsData: CommonSignsDataType = {
  // Greetings & Polite Expressions
  greetings: {
    hello: {
      description: 'Flat hand at forehead, move forward',
      difficulty: 'easy',
      usage: 'Standard greeting in ASL'
    },
    goodbye: {
      description: 'Wave hand or finger wiggle',
      difficulty: 'easy',
      usage: 'Farewell greeting'
    },
    please: {
      description: 'Flat hand circles on chest',
      difficulty: 'easy',
      usage: 'Polite request'
    },
    thank_you: {
      description: 'Flat hand touches chin, moves forward',
      difficulty: 'easy',
      usage: 'Express gratitude'
    },
    sorry: {
      description: 'Fist on chest, circular motion',
      difficulty: 'easy',
      usage: 'Apologize or express sympathy'
    }
  },
  
  // Basic Responses
  responses: {
    yes: {
      description: 'Fist nods up and down',
      difficulty: 'easy',
      usage: 'Affirmative response'
    },
    no: {
      description: 'Index and middle finger close on thumb',
      difficulty: 'easy',
      usage: 'Negative response'
    }
  },
  
  // Family & Relationships
  family: {
    mother: {
      description: 'Thumb touches chin',
      difficulty: 'easy',
      usage: 'Female parent'
    },
    father: {
      description: 'Thumb touches forehead',
      difficulty: 'easy',
      usage: 'Male parent'
    },
    sister: {
      description: 'L-hand at chin, moves down',
      difficulty: 'medium',
      usage: 'Female sibling'
    },
    brother: {
      description: 'L-hand at forehead, moves down',
      difficulty: 'medium',
      usage: 'Male sibling'
    },
    family: {
      description: 'F-hands form circle',
      difficulty: 'medium',
      usage: 'Related people group'
    },
    friend: {
      description: 'Index fingers hook together',
      difficulty: 'medium',
      usage: 'Close companion'
    },
    baby: {
      description: 'Cradling motion with arms',
      difficulty: 'easy',
      usage: 'Infant, young child'
    }
  },
  
  // Actions & Verbs
  actions: {
    eat: {
      description: 'Fingertips to mouth repeatedly',
      difficulty: 'easy',
      usage: 'Consume food'
    },
    drink: {
      description: 'C-hand to mouth, tilt up',
      difficulty: 'easy',
      usage: 'Consume liquid'
    },
    help: {
      description: 'Fist on flat palm, lift together',
      difficulty: 'medium',
      usage: 'Assist someone'
    },
    finished: {
      description: 'Five-hands flip down',
      difficulty: 'medium',
      usage: 'Completed, done'
    },
    sleep: {
      description: 'Hand to side of head, eyes closed',
      difficulty: 'easy',
      usage: 'Rest, sleep'
    },
    work: {
      description: 'S-hands tap wrists together',
      difficulty: 'medium',
      usage: 'Employment, labor'
    },
    play: {
      description: 'Y-hands shake alternately',
      difficulty: 'medium',
      usage: 'Recreation, games'
    },
    study: {
      description: 'Bent hand moves toward open palm',
      difficulty: 'medium',
      usage: 'Learn, study'
    },
    read: {
      description: 'V-hand moves down open palm',
      difficulty: 'easy',
      usage: 'Read text'
    },
    write: {
      description: 'Pinch fingers write on palm',
      difficulty: 'easy',
      usage: 'Write text'
    }
  },
  
  // Food & Drink
  food: {
    water: {
      description: 'W-hand taps chin',
      difficulty: 'easy',
      usage: 'Clear liquid, H2O'
    },
    milk: {
      description: 'Squeeze fist alternately',
      difficulty: 'easy',
      usage: 'Dairy beverage'
    },
    bread: {
      description: 'Knife hand slices other hand',
      difficulty: 'medium',
      usage: 'Baked staple food'
    }
  },
  
  // Colors
  colors: {
    red: {
      description: 'Index finger brushes lips downward',
      difficulty: 'easy',
      usage: 'Color of blood, fire'
    },
    blue: {
      description: 'B-hand shakes slightly',
      difficulty: 'easy',
      usage: 'Color of sky, ocean'
    },
    green: {
      description: 'G-hand shakes slightly',
      difficulty: 'easy',
      usage: 'Color of grass, plants'
    },
    yellow: {
      description: 'Y-hand shakes slightly',
      difficulty: 'easy',
      usage: 'Color of sun, banana'
    },
    black: {
      description: 'Index finger across forehead',
      difficulty: 'easy',
      usage: 'Absence of color'
    },
    white: {
      description: 'Five-hand on chest, pull out',
      difficulty: 'medium',
      usage: 'Color of snow, milk'
    }
  },
  
  // Numbers
  numbers: {
    one: {
      description: 'Index finger extended up',
      difficulty: 'easy',
      usage: 'Number 1, single item'
    },
    two: {
      description: 'Index and middle finger extended',
      difficulty: 'easy',
      usage: 'Number 2, pair'
    },
    three: {
      description: 'Thumb, index, middle finger extended',
      difficulty: 'easy',
      usage: 'Number 3, trio'
    },
    five: {
      description: 'All five fingers extended',
      difficulty: 'easy',
      usage: 'Number 5, hand count'
    },
    ten: {
      description: 'Thumb up, shake slightly',
      difficulty: 'easy',
      usage: 'Number 10, decimal base'
    }
  },
  
  // Emotions & Feelings
  emotions: {
    love: {
      description: 'Cross arms over chest',
      difficulty: 'easy',
      usage: 'Deep affection'
    },
    happy: {
      description: 'Flat hands brush up chest',
      difficulty: 'easy',
      usage: 'Joyful feeling'
    },
    sad: {
      description: 'Five-hands slide down face',
      difficulty: 'easy',
      usage: 'Sorrowful feeling'
    }
  },
  
  // Descriptive & Qualities
  descriptive: {
    more: {
      description: 'Fingertips tap together',
      difficulty: 'easy',
      usage: 'Additional amount'
    },
    good: {
      description: 'Flat hand from chin moves down',
      difficulty: 'easy',
      usage: 'Positive quality'
    },
    bad: {
      description: 'Flat hand flips down from chin',
      difficulty: 'easy',
      usage: 'Negative quality'
    },
    hot: {
      description: 'Claw hand turns away from mouth',
      difficulty: 'medium',
      usage: 'High temperature'
    },
    cold: {
      description: 'S-hands shake (shivering)',
      difficulty: 'easy',
      usage: 'Low temperature'
    },
    big: {
      description: 'L-hands spread apart',
      difficulty: 'easy',
      usage: 'Large size'
    },
    small: {
      description: 'Flat hands close together',
      difficulty: 'easy',
      usage: 'Little size'
    }
  }
};

// Sign Image Component
const CommonSignImage: React.FC<{ 
  word: string; 
  className?: string; 
}> = ({ word, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = `/images/signs/common/${word}.png`;

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
            {toTitleCase(word)}
          </Typography>
          <Typography variant="caption" className="text-purple-600 dark:text-purple-400">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={`ASL sign for ${word.replace(/[_-]/g, ' ')}`}
        className={`w-full h-full object-contain rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

const CommonSigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSign, setSelectedSign] = useState<{ word: string; category: string } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState(0);
  const [learningMode, setLearningMode] = useState(false);

  // Get all signs in a flat structure for filtering
  const getAllSigns = () => {
    const allSigns: Array<{ word: string; category: string; data: any }> = [];
    Object.entries(commonSignsData).forEach(([category, signs]) => {
      Object.entries(signs).forEach(([word, data]) => {
        allSigns.push({ word, category, data });
      });
    });
    return allSigns;
  };

  // Filter signs based on search term, category, and difficulty
  const filteredSigns = getAllSigns().filter(({ word, category, data }) => {
    const matchesSearch = word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.usage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || data.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get signs by category for tab view
  const getSignsByCategory = (categoryName: string) => {
    return Object.entries(commonSignsData[categoryName as keyof typeof commonSignsData] || {});
  };

  // Text-to-speech function
  const speakSign = (word: string, description: string, usage: string) => {
    if ('speechSynthesis' in window) {
      const text = `${word.replace(/[_-]/g, ' ')}. ${description}. Used for: ${usage}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  // Toggle favorite
  const toggleFavorite = (word: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(word)) {
      newFavorites.delete(word);
      toast.success(`Removed "${toTitleCase(word)}" from favorites`);
    } else {
      newFavorites.add(word);
      toast.success(`Added "${toTitleCase(word)}" to favorites`);
    }
    setFavorites(newFavorites);
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      greetings: '#10B981',    // Green
      responses: '#F59E0B',    // Yellow
      family: '#EF4444',       // Red
      actions: '#8B5CF6',      // Purple
      food: '#3B82F6',         // Blue
      colors: '#06B6D4',       // Cyan
      numbers: '#F97316',      // Orange
      emotions: '#EC4899',     // Pink
      descriptive: '#6366F1'   // Indigo
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const categories = Object.keys(commonSignsData);

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
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="font-bold mb-2">
                Common Signs Collection
              </Typography>
              <Typography variant="body1" className="opacity-90">
                Learn essential everyday ASL signs from real photographs
              </Typography>
            </div>
            <AcademicCapIcon className="h-16 w-16 opacity-20" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <Typography variant="h6" className="font-bold">
                {getAllSigns().length}
              </Typography>
              <Typography variant="body2" className="opacity-80">
                Total Signs
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" className="font-bold">
                {categories.length}
              </Typography>
              <Typography variant="body2" className="opacity-80">
                Categories
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" className="font-bold">
                {favorites.size}
              </Typography>
              <Typography variant="body2" className="opacity-80">
                Favorites
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" className="font-bold">
                Real
              </Typography>
              <Typography variant="body2" className="opacity-80">
                Photos
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Mode Toggle */}
      <div className="flex justify-center">
        <Paper className="p-1">
          <Button
            variant={learningMode ? "outlined" : "contained"}
            onClick={() => setLearningMode(false)}
            className="mr-2"
          >
            Browse All Signs
          </Button>
          <Button
            variant={learningMode ? "contained" : "outlined"}
            onClick={() => setLearningMode(true)}
            startIcon={<PlayIcon className="h-4 w-4" />}
          >
            Learning Mode
          </Button>
        </Paper>
      </div>

      {!learningMode ? (
        <>
          {/* Search and Filter Section */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search common signs... (word, description, usage)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
                  ),
                }}
                sx={{ backgroundColor: 'background.paper' }}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant={showFilters ? "contained" : "outlined"}
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FunnelIcon className="h-4 w-4" />}
              >
                Filters
              </Button>
              
              <Chip 
                label={`${filteredSigns.length} signs found`}
                color="primary"
                variant="outlined"
              />
              
              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  size="small"
                  startIcon={<ViewColumnsIcon className="h-4 w-4" />}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('list')}
                  size="small"
                  startIcon={<ListBulletIcon className="h-4 w-4" />}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Category"
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {toTitleCase(category)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        label="Difficulty"
                      >
                        <MenuItem value="all">All Levels</MenuItem>
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Signs Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredSigns.map(({ word, category, data }) => (
                <motion.div
                  key={word}
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer h-full hover:shadow-lg transition-shadow duration-200"
                    onClick={() => setSelectedSign({ word, category })}
                  >
                    <CardContent className={viewMode === 'grid' ? "p-4" : "p-4 flex items-center space-x-4"}>
                      {viewMode === 'grid' ? (
                        <>
                          {/* Sign Image */}
                          <CommonSignImage 
                            word={word}
                            className="w-full h-32 mb-4"
                          />
                          
                          {/* Word Title */}
                          <Typography variant="h6" className="font-bold mb-2 text-center">
                            {toTitleCase(word)}
                          </Typography>
                          
                          {/* Category and Difficulty */}
                          <div className="flex justify-center gap-2 mb-3">
                            <Chip 
                              label={category}
                              size="small"
                              sx={{ 
                                backgroundColor: getCategoryColor(category),
                                color: 'white',
                                fontSize: '0.75rem'
                              }}
                            />
                            <Chip 
                              label={data.difficulty}
                              size="small"
                              color={getDifficultyColor(data.difficulty) as any}
                            />
                          </div>
                          
                          {/* Description Preview */}
                          <Typography 
                            variant="body2" 
                            className="text-gray-600 dark:text-gray-300 text-center line-clamp-2 mb-3"
                          >
                            {data.description}
                          </Typography>
                          
                          {/* Action Buttons */}
                          <div className="flex justify-center gap-2">
                            <Tooltip title="Listen to description">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakSign(word, data.description, data.usage);
                                }}
                              >
                                <SpeakerWaveIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title={favorites.has(word) ? "Remove from favorites" : "Add to favorites"}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(word);
                                }}
                              >
                                {favorites.has(word) ? (
                                  <HeartIconSolid className="h-4 w-4 text-red-500" />
                                ) : (
                                  <HeartIcon className="h-4 w-4" />
                                )}
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="View details">
                              <IconButton size="small">
                                <InformationCircleIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* List View */}
                          <CommonSignImage 
                            word={word}
                            className="w-20 h-20 flex-shrink-0"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="h6" className="font-bold">
                                {toTitleCase(word)}
                              </Typography>
                              
                              <div className="flex items-center gap-2">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakSign(word, data.description, data.usage);
                                  }}
                                >
                                  <SpeakerWaveIcon className="h-4 w-4" />
                                </IconButton>
                                
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(word);
                                  }}
                                >
                                  {favorites.has(word) ? (
                                    <HeartIconSolid className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <HeartIcon className="h-4 w-4" />
                                  )}
                                </IconButton>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mb-2">
                              <Chip 
                                label={category}
                                size="small"
                                sx={{ 
                                  backgroundColor: getCategoryColor(category),
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <Chip 
                                label={data.difficulty}
                                size="small"
                                color={getDifficultyColor(data.difficulty) as any}
                              />
                            </div>
                            
                            <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                              {data.description}
                            </Typography>
                            
                            <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block mt-1">
                              Usage: {data.usage}
                            </Typography>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <>
          {/* Learning Mode - Category Tabs */}
          <Paper>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {categories.map((category, index) => (
                <Tab 
                  key={category} 
                  label={toTitleCase(category)}
                  icon={<HandRaisedIcon className="h-4 w-4" />}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Category Content */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h5" className="font-bold mb-4 text-center">
                {toTitleCase(categories[activeTab])} Signs
              </Typography>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getSignsByCategory(categories[activeTab]).map(([word, data]) => (
                  <motion.div
                    key={word}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer h-full hover:shadow-lg transition-shadow duration-200"
                      onClick={() => setSelectedSign({ word, category: categories[activeTab] })}
                    >
                      <CardContent className="p-4 text-center">
                        <CommonSignImage 
                          word={word}
                          className="w-full h-32 mb-4"
                        />
                        
                        <Typography variant="h6" className="font-bold mb-2">
                          {toTitleCase(word)}
                        </Typography>
                        
                        <Chip 
                          label={data.difficulty}
                          size="small"
                          color={getDifficultyColor(data.difficulty) as any}
                          className="mb-3"
                        />
                        
                        <Typography 
                          variant="body2" 
                          className="text-gray-600 dark:text-gray-300 line-clamp-2"
                        >
                          {data.description}
                        </Typography>
                        
                        <div className="flex justify-center mt-3">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              speakSign(word, data.description, data.usage);
                            }}
                          >
                            <SpeakerWaveIcon className="h-5 w-5" />
                          </IconButton>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Results Message */}
      {!learningMode && filteredSigns.length === 0 && (
        <div className="text-center py-12">
          <HandRaisedIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="h6" className="text-gray-600 dark:text-gray-300 mb-2">
            No signs found
          </Typography>
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters
          </Typography>
        </div>
      )}

      {/* Sign Detail Modal */}
      <Dialog
        open={selectedSign !== null}
        onClose={() => setSelectedSign(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedSign && (
          <>
            <DialogTitle className="flex items-center justify-between">
              <Typography variant="h5" className="font-bold">
                {toTitleCase(selectedSign.word)}
              </Typography>
              <IconButton onClick={() => setSelectedSign(null)}>
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              <div className="space-y-6">
                {/* Sign Image */}
                <div className="text-center">
                  <CommonSignImage 
                    word={selectedSign.word}
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                
                {/* Categories and Difficulty */}
                <div className="flex justify-center gap-4">
                  <Chip 
                    label={selectedSign.category}
                    sx={{ 
                      backgroundColor: getCategoryColor(selectedSign.category),
                      color: 'white'
                    }}
                  />
                  <Chip 
                    label={commonSignsData[selectedSign.category as keyof typeof commonSignsData][selectedSign.word].difficulty}
                    color={getDifficultyColor(commonSignsData[selectedSign.category as keyof typeof commonSignsData][selectedSign.word].difficulty) as any}
                  />
                </div>
                
                <Divider />
                
                {/* Description */}
                <div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    How to Sign:
                  </Typography>
                  <Typography variant="body1" className="mb-4">
                    {commonSignsData[selectedSign.category as keyof typeof commonSignsData][selectedSign.word].description}
                  </Typography>
                </div>
                
                {/* Usage */}
                <div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    Usage:
                  </Typography>
                  <Typography variant="body1">
                    {commonSignsData[selectedSign.category as keyof typeof commonSignsData][selectedSign.word].usage}
                  </Typography>
                </div>
              </div>
            </DialogContent>
            
            <DialogActions>
              <Button
                onClick={() => speakSign(
                  selectedSign.word,
                  commonSignsData[selectedSign.category as keyof typeof commonSignsData][selectedSign.word].description,
                  commonSignsData[selectedSign.category as keyof typeof commonSignsData][selectedSign.word].usage
                )}
                startIcon={<SpeakerWaveIcon className="h-4 w-4" />}
              >
                Listen
              </Button>
              
              <Button
                onClick={() => toggleFavorite(selectedSign.word)}
                startIcon={favorites.has(selectedSign.word) ? (
                  <HeartIconSolid className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
                color={favorites.has(selectedSign.word) ? "error" : "primary"}
              >
                {favorites.has(selectedSign.word) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              
              <Button onClick={() => setSelectedSign(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </motion.div>
  );
};

export default CommonSigns; 