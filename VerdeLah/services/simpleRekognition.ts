// Simple AWS Rekognition Service
// This service uses fetch API to avoid Babel compatibility issues

export interface SimpleRekognitionLabel {
  Name: string;
  Confidence: number;
}

export interface SimpleRekognitionResult {
  labels: SimpleRekognitionLabel[];
}

/**
 * Analyze an image using AWS Rekognition via REST API
 * @param imageUri - Local file URI
 * @returns Promise<SimpleRekognitionResult>
 */
export async function analyzeImageWithSimpleRekognition(imageUri: string): Promise<SimpleRekognitionResult> {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);
    
    // AWS Rekognition endpoint
    const region = process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-1';
    const endpoint = `https://rekognition.${region}.amazonaws.com/`;
    
    // Prepare the request
    const requestBody = {
      Image: {
        Bytes: base64Image
      },
      MaxLabels: 20,
      MinConfidence: 50
    };
    
    // Create AWS signature
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not found');
    }
    
    // For now, let's use a simplified approach
    // In production, you'd need to implement proper AWS signature v4
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'RekognitionService.DetectLabels',
        'Authorization': `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${getDateString()}/${region}/rekognition/aws4_request`,
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`AWS Rekognition error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return {
      labels: result.Labels || []
    };
  } catch (error) {
    console.error('Simple Rekognition error:', error);
    throw new Error('Failed to analyze image with AWS Rekognition');
  }
}

/**
 * Convert image URI to base64
 * @param imageUri - Local file URI
 * @returns Promise<string>
 */
async function convertImageToBase64(imageUri: string): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read image'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
}

/**
 * Get current date string for AWS signature
 * @returns string
 */
function getDateString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Get relevant labels for recycling detection
 * @param labels - Array of labels
 * @returns Array of relevant labels
 */
export function getRelevantLabels(labels: SimpleRekognitionLabel[]): SimpleRekognitionLabel[] {
  const relevantKeywords = [
    'bottle', 'can', 'container', 'package', 'box', 'bag', 'cup', 'glass',
    'plastic', 'metal', 'paper', 'cardboard', 'aluminum', 'steel', 'tin',
    'beverage', 'food', 'drink', 'water', 'soda', 'beer', 'wine',
    'milk', 'juice', 'coffee', 'tea', 'energy drink', 'sports drink',
    'yogurt', 'sauce', 'condiment', 'snack', 'candy', 'chocolate',
    'electronics', 'phone', 'computer', 'battery', 'cable', 'wire',
    'clothing', 'fabric', 'textile', 'shoe', 'hat', 'bag',
    'furniture', 'wood', 'chair', 'table', 'desk', 'shelf',
    'toy', 'game', 'book', 'magazine', 'newspaper', 'document'
  ];

  return labels.filter(label => {
    const name = label.Name.toLowerCase();
    return relevantKeywords.some(keyword => name.includes(keyword));
  });
}
