import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../app/(tabs)/services/firebase';

/**
 * Test Firebase Storage connection and permissions
 */
export async function testFirebaseStorage(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing Firebase Storage connection...');
    
    // Create a simple test blob
    const testData = new Blob(['Hello Firebase Storage!'], { type: 'text/plain' });
    
    // Create a reference to a test file
    const testRef = ref(storage, 'test/connection-test.txt');
    console.log('Test reference created');
    
    // Try to upload the test file
    const snapshot = await uploadBytes(testRef, testData);
    console.log('Test upload successful:', snapshot.metadata);
    
    // Try to get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Test download URL:', downloadURL);
    
    return { success: true };
  } catch (error) {
    console.error('Firebase Storage test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
