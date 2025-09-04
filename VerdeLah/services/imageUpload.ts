import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../app/(tabs)/services/firebase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image to Firebase Storage and returns the download URL
 * @param imageUri - Local URI of the image to upload
 * @param path - Storage path where the image should be stored (e.g., 'profile-pictures/userId.jpg')
 * @returns Promise with upload result containing the download URL
 */
export async function uploadImageToStorage(
  imageUri: string, 
  path: string
): Promise<UploadResult> {
  try {
    console.log('Starting image upload:', { imageUri, path });
    
    // Convert the image URI to a blob
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log('Image blob created, size:', blob.size);
    
    // Create a reference to the storage location
    const storageRef = ref(storage, path);
    console.log('Storage reference created:', path);
    
    // Upload the blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('Upload completed:', snapshot.metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);
    
    return {
      success: true,
      url: downloadURL
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      serverResponse: (error as any)?.serverResponse
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Uploads a profile picture for a specific user
 * @param imageUri - Local URI of the profile picture
 * @param userId - User ID to associate with the image
 * @returns Promise with upload result
 */
export async function uploadProfilePicture(
  imageUri: string, 
  userId: string
): Promise<UploadResult> {
  const timestamp = Date.now();
  const fileName = `profile-${userId}-${timestamp}.jpg`;
  const path = `profile-pictures/${fileName}`;
  
  return uploadImageToStorage(imageUri, path);
}
