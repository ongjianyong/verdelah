// AWS Configuration Service
// This service handles AWS credentials and client initialization

// AWS Configuration
export const AWS_REGION = process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-1'; // Singapore region

// Get credentials from environment variables
export const getCredentials = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials not found in environment variables');
  }
  
  return {
    accessKeyId,
    secretAccessKey,
  };
};

// Check if AWS credentials are valid
export const hasValidCredentials = (): boolean => {
  try {
    const creds = getCredentials();
    return !!(creds.accessKeyId && creds.secretAccessKey);
  } catch {
    return false;
  }
};

// Environment variables needed:
// EXPO_PUBLIC_AWS_REGION=ap-southeast-1
// AWS_ACCESS_KEY_ID=your_access_key_here
// AWS_SECRET_ACCESS_KEY=your_secret_key_here
