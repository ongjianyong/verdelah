// AWS Rekognition Service
// This service handles image analysis using AWS Rekognition

import { DetectLabelsCommand, RekognitionClient } from '@aws-sdk/client-rekognition';
import { getCredentials, AWS_REGION } from './awsConfig';

export interface RekognitionLabel {
  Name: string;
  Confidence: number;
  Categories?: Array<{
    Name: string;
  }>;
}

export interface RekognitionResult {
  labels: RekognitionLabel[];
  dominantColors?: Array<{
    name: string;
    confidence: number;
  }>;
}

/**
 * Analyze an image using AWS Rekognition
 * @param imageUri - Local file URI or base64 image data
 * @returns Promise<RekognitionResult>
 */
export async function analyzeImageWithRekognition(imageUri: string): Promise<RekognitionResult> {
  try {
    // Convert image URI to base64 if needed
    const imageBytes = await convertImageToBytes(imageUri);
    
    // Create Rekognition client with credentials
    const rekognitionClient = new RekognitionClient({
      region: AWS_REGION,
      credentials: getCredentials(),
    });
    
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      MaxLabels: 20,
      MinConfidence: 50, // Minimum confidence threshold
    });

    const response = await rekognitionClient.send(command);
    
    return {
      labels: response.Labels || [],
      dominantColors: response.Labels?.map(label => ({
        name: label.Name || '',
        confidence: label.Confidence || 0,
      })) || [],
    };
  } catch (error) {
    console.error('AWS Rekognition error:', error);
    throw new Error('Failed to analyze image with AWS Rekognition');
  }
}

/**
 * Convert image URI to bytes for AWS Rekognition
 * @param imageUri - Local file URI
 * @returns Promise<Uint8Array>
 */
async function convertImageToBytes(imageUri: string): Promise<Uint8Array> {
  try {
    // For React Native, we need to read the file and convert to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          // Convert base64 to Uint8Array
          const base64 = (reader.result as string).split(',')[1];
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          resolve(bytes);
        } else {
          reject(new Error('Failed to read image'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to bytes:', error);
    throw new Error('Failed to convert image to bytes');
  }
}

/**
 * Get the most relevant labels for recycling detection
 * @param labels - Array of Rekognition labels
 * @returns Array of relevant labels
 */
export function getRelevantLabels(labels: RekognitionLabel[]): RekognitionLabel[] {
  // Keywords that are relevant for recycling detection
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

/**
 * Extract material type from Rekognition labels
 * @param labels - Array of Rekognition labels
 * @returns Detected material type
 */
export function extractMaterialType(labels: RekognitionLabel[]): string {
  const materialKeywords = {
    'plastic': ['plastic', 'bottle', 'container', 'bag', 'cup', 'lid'],
    'glass': ['glass', 'bottle', 'jar', 'container'],
    'metal': ['metal', 'aluminum', 'steel', 'tin', 'can', 'container'],
    'paper': ['paper', 'cardboard', 'box', 'newspaper', 'magazine', 'book'],
    'fabric': ['fabric', 'textile', 'clothing', 'cloth', 'cotton', 'wool'],
    'wood': ['wood', 'wooden', 'furniture', 'chair', 'table', 'desk'],
    'electronics': ['electronics', 'phone', 'computer', 'battery', 'cable'],
    'ceramic': ['ceramic', 'pottery', 'dish', 'plate', 'bowl'],
    'rubber': ['rubber', 'tire', 'shoe', 'boot'],
    'foam': ['foam', 'styrofoam', 'polystyrene', 'cushion']
  };

  for (const [material, keywords] of Object.entries(materialKeywords)) {
    if (labels.some(label => 
      keywords.some(keyword => 
        label.Name.toLowerCase().includes(keyword)
      )
    )) {
      return material;
    }
  }

  return 'unknown';
}

/**
 * Determine if an item is likely recyclable based on labels
 * @param labels - Array of Rekognition labels
 * @returns boolean indicating if item is likely recyclable
 */
export function isLikelyRecyclable(labels: RekognitionLabel[]): boolean {
  const recyclableKeywords = [
    'bottle', 'can', 'container', 'box', 'paper', 'cardboard',
    'aluminum', 'steel', 'glass', 'plastic', 'metal'
  ];

  const nonRecyclableKeywords = [
    'styrofoam', 'foam', 'ceramic', 'rubber', 'fabric', 'textile',
    'electronics', 'battery', 'cable', 'wire', 'food', 'organic'
  ];

  const hasRecyclable = labels.some(label => 
    recyclableKeywords.some(keyword => 
      label.Name.toLowerCase().includes(keyword)
    )
  );

  const hasNonRecyclable = labels.some(label => 
    nonRecyclableKeywords.some(keyword => 
      label.Name.toLowerCase().includes(keyword)
    )
  );

  return hasRecyclable && !hasNonRecyclable;
}
