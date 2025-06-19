import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { useDeafStore } from '../utils/deafStore';
import toast from 'react-hot-toast';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    preferredLanguage: string;
    screenReaderMode: boolean;
    keyboardNavigation: boolean;
  };
  progress: any; // Will sync with deafStore
  statistics: {
    totalQuizzes: number;
    averageScore: number;
    currentStreak: number;
    bestStreak: number;
    totalStudyTime: number;
    badgesEarned: number;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { progress, badges, quizHistory } = useDeafStore();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 Firebase Auth State Changed:', {
        hasUser: !!user,
        userEmail: user?.email,
        userDisplayName: user?.displayName
      });
      
      setUser(user);
      setLoading(false);
      
      if (user) {
        console.log('👤 Loading user profile for:', user.uid);
        await loadUserProfile(user.uid);
      } else {
        console.log('❌ No user - clearing profile');
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync local data to Firebase when user data changes
  useEffect(() => {
    if (user && userProfile) {
      syncUserData();
    }
  }, [progress, badges, quizHistory, user, userProfile]);

  const loadUserProfile = async (uid: string) => {
    try {
      console.log('📋 Starting to load user profile for:', uid);
      setError(null); // Clear any previous errors
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        console.log('✅ User profile found in Firestore');
        const data = userDoc.data() as any; // Use any to handle Firestore data
        const profileData: UserProfile = {
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate?.() || new Date(data.lastLoginAt) || new Date()
        };
        console.log('📊 Setting user profile:', {
          displayName: profileData.displayName,
          email: profileData.email
        });
        setUserProfile(profileData);
        
        // Update last login time
        await updateDoc(doc(db, 'users', uid), {
          lastLoginAt: serverTimestamp()
        });
        
        // Set up real-time listener for user profile
        const unsubscribe = onSnapshot(doc(db, 'users', uid), (doc) => {
          if (doc.exists()) {
            const data = doc.data() as any; // Use any to handle Firestore data
            const updatedProfile: UserProfile = {
              ...data,
              createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
              lastLoginAt: data.lastLoginAt?.toDate?.() || new Date(data.lastLoginAt) || new Date()
            };
            console.log('🔄 Real-time profile update received');
            setUserProfile(updatedProfile);
          }
        });
        
        return unsubscribe;
      } else {
        // Create new user profile if it doesn't exist
        console.log('🆕 User profile not found, creating new profile...');
        await createUserProfile(uid);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // Don't set error for missing profile - we'll create it
      if (error instanceof Error && !error.message.includes('permission-denied')) {
        setError('Failed to load user profile');
      }
      // Still create a profile even if there was an error
      try {
        console.log('🔄 Attempting to create profile after error...');
        await createUserProfile(uid);
      } catch (createError) {
        console.error('❌ Error creating user profile:', createError);
        setError('Failed to create user profile');
      }
    }
  };

  const createUserProfile = async (uid: string) => {
    try {
      const newProfile: UserProfile = {
        uid,
        email: user?.email || '',
        displayName: user?.displayName || 'User',
        photoURL: user?.photoURL || undefined,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          preferredLanguage: 'en',
          screenReaderMode: false,
          keyboardNavigation: true
        },
        progress: {
          flashcards: { completed: 0, total: 50, currentStreak: 0, bestStreak: 0 },
          alphabet: { completed: 0, total: 26, currentStreak: 0, bestStreak: 0 },
          commonSigns: { completed: 0, total: 100, currentStreak: 0, bestStreak: 0 },
          dictionary: { searched: 0, favorites: [] }
        },
        statistics: {
          totalQuizzes: 0,
          averageScore: 0,
          currentStreak: 0,
          bestStreak: 0,
          totalStudyTime: 0,
          badgesEarned: 0
        }
      };

      await setDoc(doc(db, 'users', uid), {
        ...newProfile,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
      
      setUserProfile(newProfile);
      toast.success('Welcome to LinK! Your profile has been created.');
    } catch (error) {
      console.error('Error creating user profile:', error);
      setError('Failed to create user profile');
    }
  };

  const syncUserData = async () => {
    if (!user || !userProfile) return;

    try {
      const earnedBadges = badges.filter(badge => badge.earned);
      const averageScore = quizHistory.length > 0 
        ? quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions), 0) / quizHistory.length * 100
        : 0;

      const updatedProfile = {
        ...userProfile,
        progress,
        statistics: {
          ...userProfile.statistics,
          totalQuizzes: quizHistory.length,
          averageScore: Math.round(averageScore),
          badgesEarned: earnedBadges.length
        },
        lastLoginAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'users', user.uid), updatedProfile);
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return result;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Failed to sign in';
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(result.user, { displayName });
      
      toast.success('Account created successfully!');
      return result;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Failed to create account';
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔍 Starting Google sign-in...');
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign-in successful:', result.user.email);
      toast.success('Welcome!');
      return result;
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      const errorMessage = error.code === 'auth/popup-closed-by-user'
        ? 'Sign in was cancelled'
        : error.code === 'auth/popup-blocked'
        ? 'Popup was blocked. Please allow popups for this site'
        : 'Failed to sign in with Google';
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          ...preferences
        }
      };

      await updateDoc(doc(db, 'users', user.uid), { preferences: updatedProfile.preferences });
      setUserProfile(updatedProfile);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    updateUserPreferences,
    syncUserData
  };
}; 