import { auth, db } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🔥 Starting comprehensive Firebase test...');
  
  try {
    // Test 1: Firebase Auth availability
    console.log('Test 1: Firebase Auth availability');
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    console.log('✅ Firebase Auth is available');
    
    // Test 2: Firebase Firestore availability  
    console.log('Test 2: Firebase Firestore availability');
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    console.log('✅ Firebase Firestore is available');
    
    // Test 3: Anonymous auth (to test connection)
    console.log('Test 3: Testing authentication with anonymous sign-in');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Anonymous authentication successful:', userCredential.user.uid);
    
    // Test 4: Firestore write/read test
    console.log('Test 4: Testing Firestore read/write');
    const testDoc = doc(db, 'test', 'connection-test');
    await setDoc(testDoc, {
      timestamp: new Date(),
      test: 'Firebase connection test successful'
    });
    
    const testRead = await getDoc(testDoc);
    if (testRead.exists()) {
      console.log('✅ Firestore read/write test successful');
    } else {
      throw new Error('Firestore read test failed');
    }
    
    console.log('🎉 All Firebase tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return false;
  }
}; 