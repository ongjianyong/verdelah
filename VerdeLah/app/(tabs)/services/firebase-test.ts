import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function testFirebaseConnections() {
  console.log(' Testing Firebase connections...');
  
  try {
    // Test Firestore connection
    console.log(' Testing Firestore connection...');
    const testCollection = collection(db, 'users');
    await getDocs(testCollection);
    console.log(' Firestore connection successful');
    
    // Test Auth connection
    console.log(' Testing Auth connection...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth connection successful');
      console.log(' Current user:', user ? user.email : 'No user signed in');
      unsubscribe();
    });
    
    
    return { success: true, message: 'Firebase connections working' };
  } catch (error) {
    console.error(' Firebase connection error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

