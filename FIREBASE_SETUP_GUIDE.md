# Firebase Authentication Setup Guide for LinK

## Overview
This guide will help you set up Firebase Authentication for the LinK accessibility learning platform. Firebase will handle user registration, login, and data persistence for user progress, achievements, and preferences.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `link-accessibility-platform` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Create the project

## Step 2: Enable Authentication

1. In the Firebase Console, go to **Authentication** → **Get started**
2. Go to the **Sign-in method** tab
3. Enable the following sign-in providers:
   - **Email/Password**: Click → Enable → Save
   - **Google**: Click → Enable → Enter project support email → Save

## Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location (closest to your users)
4. Click **Done**

## Step 4: Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to "Your apps" section
3. Click **Web** (</>) icon to add a web app
4. Enter app nickname: `LinK Frontend`
5. Check "Also set up Firebase Hosting" (optional)
6. Click **Register app**
7. Copy the Firebase configuration object

## Step 5: Set Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```bash
# Frontend Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Backend Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Step 6: Firestore Security Rules (For Production)

When ready for production, update Firestore rules to secure user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

### ✅ Authentication Features
- **Email/Password Registration & Login**
- **Google OAuth Login**
- **Password Reset** (via Firebase)
- **User Profile Management**
- **Automatic Account Creation**

### ✅ User Data Management
- **Progress Tracking**: Flashcards, Alphabet, Common Signs
- **Badge System**: Achievements and milestones
- **Quiz History**: Performance tracking over time
- **User Preferences**: Accessibility settings
- **Real-time Sync**: Data syncs across devices

### ✅ User Profile Dashboard
- **Statistics Overview**: Total quizzes, average scores, streaks
- **Progress Visualization**: Linear progress bars for each section
- **Recent Achievements**: Latest badges earned
- **Quiz History**: Recent quiz results with scores
- **Settings Panel**: Accessibility preferences

## Authentication Flow

1. **New Users**:
   - Register with email/password or Google
   - Profile is automatically created in Firestore
   - Default progress and preferences are set

2. **Returning Users**:
   - Sign in with email/password or Google
   - Profile data is loaded from Firestore
   - Progress and achievements are synced

3. **Data Persistence**:
   - All user progress is automatically saved to Firestore
   - Real-time listeners keep data in sync
   - Offline support with automatic sync when back online

## Testing the Authentication

1. **Sign Up**: Create a new account using email or Google
2. **Profile Creation**: Verify user profile is created in Firestore
3. **Data Persistence**: Complete some activities and check data saves
4. **Sign Out/In**: Verify data persists across sessions
5. **Profile Page**: Visit `/profile` to see user dashboard

## Navigation Integration

The authentication system is integrated into the main navigation:

- **Sign In Button**: When not authenticated
- **User Avatar & Menu**: When authenticated
- **Profile Link**: Access to user dashboard
- **Sign Out Option**: In user menu
- **Mobile Support**: Full authentication UI in mobile menu

## Database Structure

User documents in Firestore follow this structure:

```javascript
/users/{userId} {
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  preferences: {
    highContrast: boolean,
    largeText: boolean,
    reducedMotion: boolean,
    preferredLanguage: string,
    screenReaderMode: boolean,
    keyboardNavigation: boolean
  },
  progress: {
    flashcards: { completed: number, total: number, currentStreak: number, bestStreak: number },
    alphabet: { completed: number, total: number, currentStreak: number, bestStreak: number },
    commonSigns: { completed: number, total: number, currentStreak: number, bestStreak: number },
    dictionary: { searched: number, favorites: array }
  },
  statistics: {
    totalQuizzes: number,
    averageScore: number,
    currentStreak: number,
    bestStreak: number,
    totalStudyTime: number,
    badgesEarned: number
  }
}
```

## Troubleshooting

### Common Issues:

1. **Firebase Not Configured**: Make sure all environment variables are set correctly
2. **Authentication Errors**: Check Firebase Console for enabled auth methods
3. **Firestore Permissions**: Verify Firestore rules allow read/write access
4. **CORS Errors**: Ensure your domain is added to Firebase authorized domains

### Error Messages:

- `Firebase not initialized`: Check environment variables
- `auth/operation-not-allowed`: Enable auth method in Firebase Console
- `permission-denied`: Update Firestore security rules

## Next Steps

1. **Set up Firebase project** using this guide
2. **Configure environment variables** with your Firebase credentials
3. **Test authentication** by creating an account
4. **Verify data persistence** by completing some learning activities
5. **Customize** user preferences and test accessibility features

Your LinK platform now has a complete authentication system with user progress tracking and Firebase integration! 🎉 