import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  SpeakerWaveIcon,
  HeartIcon,
  InformationCircleIcon,
  XMarkIcon,
  HandRaisedIcon,
  BookmarkIcon
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
  Tooltip
} from '@mui/material';
import { useDeafStore } from '../../utils/deafStore';
import toast from 'react-hot-toast';

// Helper function to convert string to title case
const toTitleCase = (str: string): string => {
  return str.replace('_', ' ').replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// ASL Dictionary Data
const dictionaryData = {
  signs: {
    // Basic Greetings & Polite Expressions
    hello: {
      category: 'greetings',
      description: 'Flat hand at forehead, move forward slightly',
      difficulty: 'easy',
      usage: 'Standard greeting in ASL'
    },
    thank_you: {
      category: 'greetings',
      description: 'Flat hand touches chin, moves forward',
      difficulty: 'easy',
      usage: 'Express gratitude'
    },
    please: {
      category: 'greetings',
      description: 'Flat hand circles on chest',
      difficulty: 'easy',
      usage: 'Polite request'
    },
    sorry: {
      category: 'greetings',
      description: 'Fist on chest, circular motion',
      difficulty: 'easy',
      usage: 'Apologize or express sympathy'
    },
    goodbye: {
      category: 'greetings',
      description: 'Wave hand or finger wiggle',
      difficulty: 'easy',
      usage: 'Farewell greeting'
    },
    nice_to_meet_you: {
      category: 'greetings',
      description: 'Complex phrase: NICE + MEET + YOU',
      difficulty: 'medium',
      usage: 'First time meeting someone'
    },
    
    // Family & Relationships
    mother: {
      category: 'family',
      description: 'Thumb touches chin',
      difficulty: 'easy',
      usage: 'Female parent'
    },
    father: {
      category: 'family',
      description: 'Thumb touches forehead',
      difficulty: 'easy',
      usage: 'Male parent'
    },
    sister: {
      category: 'family',
      description: 'L-hand at chin, moves down to meet other L-hand',
      difficulty: 'medium',
      usage: 'Female sibling'
    },
    brother: {
      category: 'family',
      description: 'L-hand at forehead, moves down to meet other L-hand',
      difficulty: 'medium',
      usage: 'Male sibling'
    },
    family: {
      category: 'family',
      description: 'F-hands form circle',
      difficulty: 'medium',
      usage: 'Related people group'
    },
    friend: {
      category: 'family',
      description: 'Index fingers hook together twice',
      difficulty: 'medium',
      usage: 'Close companion'
    },
    
    // Food & Drink
    eat: {
      category: 'food',
      description: 'Fingertips to mouth repeatedly',
      difficulty: 'easy',
      usage: 'Consume food'
    },
    drink: {
      category: 'food',
      description: 'C-hand to mouth, tilt up',
      difficulty: 'easy',
      usage: 'Consume liquid'
    },
    water: {
      category: 'food',
      description: 'W-hand taps chin',
      difficulty: 'easy',
      usage: 'Clear liquid, H2O'
    },
    milk: {
      category: 'food',
      description: 'Squeeze fist alternately',
      difficulty: 'easy',
      usage: 'Dairy beverage'
    },
    coffee: {
      category: 'food',
      description: 'S-hand grinds on top of other S-hand',
      difficulty: 'medium',
      usage: 'Caffeinated beverage'
    },
    bread: {
      category: 'food',
      description: 'Knife hand slices other hand',
      difficulty: 'medium',
      usage: 'Baked staple food'
    },
    
    // Colors
    red: {
      category: 'colors',
      description: 'Index finger brushes lips downward',
      difficulty: 'easy',
      usage: 'Color of blood, fire'
    },
    blue: {
      category: 'colors',
      description: 'B-hand shakes slightly',
      difficulty: 'easy',
      usage: 'Color of sky, ocean'
    },
    green: {
      category: 'colors',
      description: 'G-hand shakes slightly',
      difficulty: 'easy',
      usage: 'Color of grass, plants'
    },
    yellow: {
      category: 'colors',
      description: 'Y-hand shakes slightly',
      difficulty: 'easy',
      usage: 'Color of sun, banana'
    },
    black: {
      category: 'colors',
      description: 'Index finger across forehead',
      difficulty: 'easy',
      usage: 'Absence of color'
    },
    white: {
      category: 'colors',
      description: 'Five-hand on chest, pull out to closed hand',
      difficulty: 'medium',
      usage: 'Color of snow, milk'
    },
    
    // Numbers (basic)
    one: {
      category: 'numbers',
      description: 'Index finger extended up',
      difficulty: 'easy',
      usage: 'Number 1, single item'
    },
    two: {
      category: 'numbers',
      description: 'Index and middle finger extended',
      difficulty: 'easy',
      usage: 'Number 2, pair'
    },
    three: {
      category: 'numbers',
      description: 'Thumb, index, and middle finger extended',
      difficulty: 'easy',
      usage: 'Number 3, trio'
    },
    five: {
      category: 'numbers',
      description: 'All five fingers extended',
      difficulty: 'easy',
      usage: 'Number 5, hand count'
    },
    ten: {
      category: 'numbers',
      description: 'Thumb up, shake slightly',
      difficulty: 'easy',
      usage: 'Number 10, decimal base'
    },
    
    // Time & Calendar
    today: {
      category: 'time',
      description: 'NOW + DAY combination',
      difficulty: 'medium',
      usage: 'Current day'
    },
    tomorrow: {
      category: 'time',
      description: 'Thumbs-up moves forward from cheek',
      difficulty: 'medium',
      usage: 'Next day'
    },
    yesterday: {
      category: 'time',
      description: 'Thumbs-up moves back from cheek',
      difficulty: 'medium',
      usage: 'Previous day'
    },
    time: {
      category: 'time',
      description: 'Index finger taps wrist',
      difficulty: 'easy',
      usage: 'Clock time, duration'
    },
    week: {
      category: 'time',
      description: 'One-hand slides across other palm',
      difficulty: 'medium',
      usage: 'Seven day period'
    },
    month: {
      category: 'time',
      description: 'One-hand slides down other index finger',
      difficulty: 'medium',
      usage: 'Calendar month'
    },
    
    // Common Verbs & Actions
    go: {
      category: 'verbs',
      description: 'Index fingers point and move forward',
      difficulty: 'easy',
      usage: 'Move, travel, leave'
    },
    come: {
      category: 'verbs',
      description: 'Index fingers point and move toward body',
      difficulty: 'easy',
      usage: 'Move toward speaker'
    },
    see: {
      category: 'verbs',
      description: 'V-hand from eyes moves forward',
      difficulty: 'easy',
      usage: 'Visual perception'
    },
    help: {
      category: 'verbs',
      description: 'Fist on flat palm, lift together',
      difficulty: 'medium',
      usage: 'Assist, support'
    },
    work: {
      category: 'verbs',
      description: 'S-hands tap wrists together',
      difficulty: 'medium',
      usage: 'Employment, labor'
    },
    play: {
      category: 'verbs',
      description: 'Y-hands shake alternately',
      difficulty: 'medium',
      usage: 'Recreation, games'
    },
    
    // Questions & Answers
    what: {
      category: 'questions',
      description: 'Index finger shakes side to side',
      difficulty: 'easy',
      usage: 'Question word for things'
    },
    where: {
      category: 'questions',
      description: 'Index finger shakes back and forth',
      difficulty: 'easy',
      usage: 'Question word for location'
    },
    when: {
      category: 'questions',
      description: 'Index finger circles around other index finger',
      difficulty: 'medium',
      usage: 'Question word for time'
    },
    who: {
      category: 'questions',
      description: 'Index finger circles around lips',
      difficulty: 'medium',
      usage: 'Question word for person'
    },
    why: {
      category: 'questions',
      description: 'Touch forehead, then Y-hand shakes',
      difficulty: 'medium',
      usage: 'Question word for reason'
    },
    how: {
      category: 'questions',
      description: 'Bent hands turn up together',
      difficulty: 'medium',
      usage: 'Question word for method'
    },
    
    // Personal Pronouns
    i: {
      category: 'pronouns',
      description: 'Index finger points to chest',
      difficulty: 'easy',
      usage: 'First person singular'
    },
    you: {
      category: 'pronouns',
      description: 'Index finger points to person',
      difficulty: 'easy',
      usage: 'Second person'
    },
    he: {
      category: 'pronouns',
      description: 'Point to male person or side',
      difficulty: 'easy',
      usage: 'Third person masculine'
    },
    she: {
      category: 'pronouns',
      description: 'Point to female person or side',
      difficulty: 'easy',
      usage: 'Third person feminine'
    },
    we: {
      category: 'pronouns',
      description: 'Index finger arcs from self to others',
      difficulty: 'medium',
      usage: 'First person plural'
    },
    they: {
      category: 'pronouns',
      description: 'Point to multiple people or sweep',
      difficulty: 'medium',
      usage: 'Third person plural'
    }
  },
  categories: ['greetings', 'family', 'food', 'colors', 'numbers', 'time', 'verbs', 'questions', 'pronouns'],
  difficulty_levels: ['easy', 'medium', 'hard'],
  total_signs: 53
};

// Sign Image Component
const DictionarySignImage: React.FC<{ 
  word: string; 
  className?: string; 
}> = ({ word, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = `/images/signs/dictionary/${word}.svg`;

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
        alt={`ASL sign for ${word.replace('_', ' ')}`}
        className={`w-full h-full object-contain rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

const Dictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter signs based on search term, category, and difficulty
  const filteredSigns = Object.entries(dictionaryData.signs).filter(([word, data]) => {
    const matchesSearch = word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.usage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || data.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || data.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Text-to-speech function
  const speakSign = (word: string, description: string, usage: string) => {
    if ('speechSynthesis' in window) {
      const text = `${word.replace('_', ' ')}. ${description}. Used for: ${usage}`;
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
      toast.success(`Removed "${word.replace('_', ' ')}" from favorites`);
    } else {
      newFavorites.add(word);
      toast.success(`Added "${word.replace('_', ' ')}" to favorites`);
    }
    setFavorites(newFavorites);
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      greetings: '#10B981',    // Green
      family: '#F59E0B',       // Yellow
      food: '#EF4444',         // Red
      colors: '#8B5CF6',       // Purple
      numbers: '#3B82F6',      // Blue
      time: '#06B6D4',         // Cyan
      verbs: '#F97316',        // Orange
      questions: '#EC4899',    // Pink
      pronouns: '#6366F1'      // Indigo
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
      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search ASL signs... (word, description, usage)"
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
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('list')}
              size="small"
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
                    {dictionaryData.categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
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
                    {dictionaryData.difficulty_levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dictionary Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        <AnimatePresence>
          {filteredSigns.map(([word, data]) => (
            <motion.div
              key={word}
              variants={itemVariants}
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer h-full hover:shadow-lg transition-shadow duration-200"
                onClick={() => setSelectedSign(word)}
              >
                <CardContent className={viewMode === 'grid' ? "p-4" : "p-4 flex items-center space-x-4"}>
                  {viewMode === 'grid' ? (
                    <>
                      {/* Sign Image */}
                      <DictionarySignImage 
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
                          label={data.category}
                          size="small"
                          sx={{ 
                            backgroundColor: getCategoryColor(data.category),
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
                        className="text-gray-600 dark:text-gray-300 text-center line-clamp-2"
                      >
                        {data.description}
                      </Typography>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-center mt-4 gap-2">
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
                      <DictionarySignImage 
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
                            label={data.category}
                            size="small"
                            sx={{ 
                              backgroundColor: getCategoryColor(data.category),
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

      {/* No Results Message */}
      {filteredSigns.length === 0 && (
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
                {toTitleCase(selectedSign)}
              </Typography>
              <IconButton onClick={() => setSelectedSign(null)}>
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              <div className="space-y-6">
                {/* Sign Image */}
                <div className="text-center">
                  <DictionarySignImage 
                    word={selectedSign}
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                
                {/* Categories and Difficulty */}
                <div className="flex justify-center gap-4">
                  <Chip 
                    label={dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].category}
                    sx={{ 
                      backgroundColor: getCategoryColor(dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].category),
                      color: 'white'
                    }}
                  />
                  <Chip 
                    label={dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].difficulty}
                    color={getDifficultyColor(dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].difficulty) as any}
                  />
                </div>
                
                <Divider />
                
                {/* Description */}
                <div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    How to Sign:
                  </Typography>
                  <Typography variant="body1" className="mb-4">
                    {dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].description}
                  </Typography>
                </div>
                
                {/* Usage */}
                <div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    Usage:
                  </Typography>
                  <Typography variant="body1">
                    {dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].usage}
                  </Typography>
                </div>
              </div>
            </DialogContent>
            
            <DialogActions>
              <Button
                onClick={() => speakSign(
                  selectedSign,
                  dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].description,
                  dictionaryData.signs[selectedSign as keyof typeof dictionaryData.signs].usage
                )}
                startIcon={<SpeakerWaveIcon className="h-4 w-4" />}
              >
                Listen
              </Button>
              
              <Button
                onClick={() => toggleFavorite(selectedSign)}
                startIcon={favorites.has(selectedSign) ? (
                  <HeartIconSolid className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
                color={favorites.has(selectedSign) ? "error" : "primary"}
              >
                {favorites.has(selectedSign) ? "Remove from Favorites" : "Add to Favorites"}
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

export default Dictionary; 