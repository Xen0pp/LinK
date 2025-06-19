import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  type: 'flashcard' | 'alphabet' | 'common-signs' | 'dictionary';
}

interface Progress {
  flashcards: {
    completed: number;
    total: number;
    currentStreak: number;
    bestStreak: number;
  };
  alphabet: {
    completed: number;
    total: number;
    currentStreak: number;
    bestStreak: number;
  };
  commonSigns: {
    completed: number;
    total: number;
    currentStreak: number;
    bestStreak: number;
  };
  dictionary: {
    searched: number;
    favorites: string[];
  };
}

interface DeafStore {
  // Progress tracking
  progress: Progress;
  currentStreak: number;
  totalSessionsCompleted: number;
  
  // Badges
  badges: Badge[];
  
  // Quiz history
  quizHistory: QuizResult[];
  
  // Current session
  currentTab: string;
  
  // Actions
  updateProgress: (category: keyof Progress, updates: Partial<Progress[keyof Progress]>) => void;
  addQuizResult: (result: QuizResult) => void;
  earnBadge: (badgeId: string) => void;
  setCurrentTab: (tab: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addToFavorites: (signId: string) => void;
  removeFromFavorites: (signId: string) => void;
  getTotalBadgesEarned: () => number;
  getAverageQuizScore: () => number;
}

const initialBadges: Badge[] = [
  {
    id: 'first-quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    earned: false,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 90% or higher on 5 quizzes',
    icon: '🏆',
    earned: false,
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    earned: false,
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    earned: false,
  },
  {
    id: 'alphabet-expert',
    name: 'Alphabet Expert',
    description: 'Complete all alphabet lessons',
    icon: '📚',
    earned: false,
  },
  {
    id: 'sign-collector',
    name: 'Sign Collector',
    description: 'Add 20 signs to favorites',
    icon: '⭐',
    earned: false,
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💯',
    earned: false,
  },
];

const initialProgress: Progress = {
  flashcards: {
    completed: 0,
    total: 50, // Example total
    currentStreak: 0,
    bestStreak: 0,
  },
  alphabet: {
    completed: 0,
    total: 26, // A-Z
    currentStreak: 0,
    bestStreak: 0,
  },
  commonSigns: {
    completed: 0,
    total: 100, // Example total
    currentStreak: 0,
    bestStreak: 0,
  },
  dictionary: {
    searched: 0,
    favorites: [],
  },
};

export const useDeafStore = create<DeafStore>()(
  persist(
    (set, get) => ({
      progress: initialProgress,
      currentStreak: 0,
      totalSessionsCompleted: 0,
      badges: initialBadges,
      quizHistory: [],
      currentTab: 'flashcards',

      updateProgress: (category, updates) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [category]: {
              ...state.progress[category],
              ...updates,
            },
          },
        }));
      },

      addQuizResult: (result) => {
        set((state) => {
          const newHistory = [...state.quizHistory, {
            ...result,
            completedAt: new Date() // Ensure it's a proper Date object
          }];
          let newBadges = [...state.badges];

          // Check for badge achievements
          if (state.quizHistory.length === 0) {
            // First quiz badge
            newBadges = newBadges.map(badge =>
              badge.id === 'first-quiz' 
                ? { ...badge, earned: true, earnedAt: new Date() }
                : badge
            );
          }

          if (result.score === result.totalQuestions) {
            // Perfect score badge
            newBadges = newBadges.map(badge =>
              badge.id === 'perfect-score'
                ? { ...badge, earned: true, earnedAt: new Date() }
                : badge
            );
          }

          // Quiz master badge (90% on 5 quizzes)
          const highScoreQuizzes = newHistory.filter(
            quiz => (quiz.score / quiz.totalQuestions) >= 0.9
          );
          if (highScoreQuizzes.length >= 5) {
            newBadges = newBadges.map(badge =>
              badge.id === 'quiz-master'
                ? { ...badge, earned: true, earnedAt: new Date() }
                : badge
            );
          }

          return {
            quizHistory: newHistory,
            badges: newBadges,
            totalSessionsCompleted: state.totalSessionsCompleted + 1,
          };
        });
      },

      earnBadge: (badgeId) => {
        set((state) => ({
          badges: state.badges.map(badge =>
            badge.id === badgeId
              ? { ...badge, earned: true, earnedAt: new Date() }
              : badge
          ),
        }));
      },

      setCurrentTab: (tab) => {
        set({ currentTab: tab });
      },

      incrementStreak: () => {
        set((state) => {
          const newStreak = state.currentStreak + 1;
          let newBadges = [...state.badges];

          // Check streak badges
          if (newStreak >= 3) {
            newBadges = newBadges.map(badge =>
              badge.id === 'streak-starter'
                ? { ...badge, earned: true, earnedAt: new Date() }
                : badge
            );
          }
          if (newStreak >= 7) {
            newBadges = newBadges.map(badge =>
              badge.id === 'streak-master'
                ? { ...badge, earned: true, earnedAt: new Date() }
                : badge
            );
          }

          return {
            currentStreak: newStreak,
            badges: newBadges,
          };
        });
      },

      resetStreak: () => {
        set({ currentStreak: 0 });
      },

      addToFavorites: (signId) => {
        set((state) => {
          const newFavorites = [...state.progress.dictionary.favorites, signId];
          let newBadges = [...state.badges];

          // Check sign collector badge
          if (newFavorites.length >= 20) {
            newBadges = newBadges.map(badge =>
              badge.id === 'sign-collector'
                ? { ...badge, earned: true, earnedAt: new Date() }
                : badge
            );
          }

          return {
            progress: {
              ...state.progress,
              dictionary: {
                ...state.progress.dictionary,
                favorites: newFavorites,
              },
            },
            badges: newBadges,
          };
        });
      },

      removeFromFavorites: (signId) => {
        set((state) => ({
          progress: {
            ...state.progress,
            dictionary: {
              ...state.progress.dictionary,
              favorites: state.progress.dictionary.favorites.filter(id => id !== signId),
            },
          },
        }));
      },

      getTotalBadgesEarned: () => {
        return get().badges.filter(badge => badge.earned).length;
      },

      getAverageQuizScore: () => {
        const { quizHistory } = get();
        if (quizHistory.length === 0) return 0;
        
        const totalScore = quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions), 0);
        return Math.round((totalScore / quizHistory.length) * 100);
      },
    }),
    {
      name: 'deaf-learning-storage',
      storage: createJSONStorage(() => localStorage),
      // Custom serialization to handle dates
      serialize: (state) => {
        return JSON.stringify(state, (key, value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        });
      },
      deserialize: (str) => {
        return JSON.parse(str, (key, value) => {
          if (key === 'earnedAt' || key === 'completedAt') {
            return value ? new Date(value) : value;
          }
          return value;
        });
      },
    }
  )
); 