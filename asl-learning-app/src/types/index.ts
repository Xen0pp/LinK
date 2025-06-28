import { User as FirebaseUser } from 'firebase/auth';

// User Types
export interface User extends FirebaseUser {
  preferences?: UserPreferences;
  progress?: UserProgress;
  stats?: UserStats;
}

export interface UserPreferences {
  accessibilityMode: 'deaf' | 'blind' | null;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  voiceEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UserProgress {
  alphabetProgress: number;
  dictionaryProgress: number;
  flashcardsProgress: number;
  commonSignsProgress: number;
  totalLessonsCompleted: number;
  streakDays: number;
  lastStudyDate: Date;
}

export interface UserStats {
  totalSignsLearned: number;
  accuracyRate: number;
  averageSessionTime: number;
  totalStudyTime: number;
  practiceSessionsCompleted: number;
  achievementsUnlocked: string[];
}

// ASL Sign Types
export interface ASLSign {
  id: string;
  word: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  category: SignCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  dateAdded: Date;
  isLearned?: boolean;
  practiceCount?: number;
}

export interface SignCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  frontText: string;
  backText: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isKnown: boolean;
  reviewCount: number;
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardSession {
  id: string;
  cards: Flashcard[];
  currentIndex: number;
  correctAnswers: number;
  totalQuestions: number;
  sessionType: 'practice' | 'review' | 'test';
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  videoUrl?: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: QuizAnswer[];
  completedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'audio';
  metadata?: {
    confidence?: number;
    language?: string;
    translatedText?: string;
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Voice Recognition Types
export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
  category: 'navigation' | 'interaction' | 'accessibility';
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

// AI Service Types
export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    model?: string;
    processingTime?: number;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
    };
  };
}

export interface ImageAnalysisResult {
  detectedObjects: DetectedObject[];
  text: string;
  confidence: number;
  language: string;
  processingTime: number;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Accessibility Types
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  voiceNavigation: boolean;
  colorBlindFriendly: boolean;
  focusIndicators: boolean;
}

export interface AccessibilityPreference {
  type: 'visual' | 'auditory' | 'motor' | 'cognitive';
  severity: 'mild' | 'moderate' | 'severe';
  assistiveTechnology: string[];
  preferredInteractionMethod: 'touch' | 'voice' | 'keyboard' | 'eye-tracking';
}

// Tool Types
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'vision' | 'hearing' | 'mobility' | 'cognitive';
  iconUrl: string;
  isAvailable: boolean;
  requiresAuth: boolean;
  lastUsed?: Date;
  usageCount: number;
}

export interface ToolResult {
  toolId: string;
  input: any;
  output: any;
  success: boolean;
  error?: string;
  processingTime: number;
  timestamp: Date;
}

// Progress Tracking Types
export interface LearningProgress {
  moduleId: string;
  userId: string;
  completionPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  timeSpent: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  category: 'learning' | 'practice' | 'social' | 'milestone';
  pointsAwarded: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  accessibilityLabel?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}

// Component Props Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  ariaLabel?: string;
  tabIndex?: number;
  role?: string;
}

// Gesture Types
export interface GestureRecognitionResult {
  gesture: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  keypoints: GestureKeypoint[];
}

export interface GestureKeypoint {
  x: number;
  y: number;
  confidence: number;
  label: string;
}

// State Management Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  preferences: UserPreferences;
  notifications: Notification[];
  currentSession: ChatSession | null;
  learningProgress: LearningProgress[];
  achievements: Achievement[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type Theme = 'light' | 'dark' | 'auto';
export type AccessibilityMode = 'deaf' | 'blind' | null; 