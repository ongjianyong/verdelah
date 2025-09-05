// AWS Rekognition Service
// This service handles image analysis using AWS Rekognition

let DetectLabelsCommand: any;
let RekognitionClient: any;

// Dynamic import to handle potential AWS SDK issues
let awsSdkAvailable = false;

// Try to load AWS SDK
const awsSdk = require('@aws-sdk/client-rekognition');
console.log('AWS SDK loaded, checking classes...');
console.log('DetectLabelsCommand:', typeof awsSdk.DetectLabelsCommand);
console.log('RekognitionClient:', typeof awsSdk.RekognitionClient);

if (awsSdk.DetectLabelsCommand && awsSdk.RekognitionClient) {
  DetectLabelsCommand = awsSdk.DetectLabelsCommand;
  RekognitionClient = awsSdk.RekognitionClient;
  awsSdkAvailable = true;
  console.log('AWS SDK classes loaded successfully, awsSdkAvailable set to:', awsSdkAvailable);
} else {
  console.error('AWS SDK classes not properly loaded - DetectLabelsCommand:', !!awsSdk.DetectLabelsCommand, 'RekognitionClient:', !!awsSdk.RekognitionClient);
  // Fallback implementations
  DetectLabelsCommand = class { constructor() {} };
  RekognitionClient = class { 
    constructor() {} 
    send() { 
      throw new Error('AWS SDK not available'); 
    } 
  };
}

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
    console.log('Starting AWS Rekognition analysis...');
    console.log('awsSdkAvailable:', awsSdkAvailable);
    console.log('DetectLabelsCommand type:', typeof DetectLabelsCommand);
    console.log('RekognitionClient type:', typeof RekognitionClient);
    
    // Check if AWS SDK is available - be more lenient with the check
    if (!DetectLabelsCommand || !RekognitionClient) {
      throw new Error('AWS SDK classes not available - DetectLabelsCommand: ' + typeof DetectLabelsCommand + ', RekognitionClient: ' + typeof RekognitionClient);
    }
    
    // Additional check for the send method
    if (typeof RekognitionClient.prototype.send !== 'function') {
      console.warn('RekognitionClient does not have send method on prototype, but continuing...');
    }
    
    // Convert image URI to base64 if needed
    console.log('Converting image to bytes...');
    const imageBytes = await convertImageToBytes(imageUri);
    console.log('Image bytes length:', imageBytes.length);
    
    // Create Rekognition client with credentials
    console.log('Creating Rekognition client...');
    const rekognitionClient = new RekognitionClient({
      region: AWS_REGION,
      credentials: getCredentials(),
    });
    
    console.log('Rekognition client created:', typeof rekognitionClient);
    console.log('Rekognition client send method:', typeof rekognitionClient.send);
    
    // Verify the client has the send method
    if (typeof rekognitionClient.send !== 'function') {
      console.error('RekognitionClient does not have send method - type: ' + typeof rekognitionClient.send);
      throw new Error('RekognitionClient does not have send method - type: ' + typeof rekognitionClient.send);
    }
    
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      MaxLabels: 20,
      MinConfidence: 50, // Minimum confidence threshold
    });

    console.log('Sending command to AWS Rekognition...');
    const response = await rekognitionClient.send(command);
    console.log('AWS Rekognition response received:', response);
    
    return {
      labels: response.Labels || [],
      dominantColors: response.Labels?.map((label: any) => ({
        name: label.Name || '',
        confidence: label.Confidence || 0,
      })) || [],
    };
  } catch (error) {
    console.error('AWS Rekognition error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error('Failed to analyze image with AWS Rekognition: ' + errorMessage);
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
  // Check if labels is valid
  if (!labels || !Array.isArray(labels)) {
    console.warn('getRelevantLabels called with invalid labels:', labels);
    return [];
  }
  
  // Keywords that are relevant for recycling detection and eco-friendly items
  const relevantKeywords = [
    // Traditional recyclable items
    'bottle', 'can', 'container', 'package', 'box', 'bag', 'cup', 'glass',
    'plastic', 'metal', 'paper', 'cardboard', 'aluminum', 'steel', 'tin',
    'beverage', 'food', 'drink', 'water', 'soda', 'beer', 'wine',
    'milk', 'juice', 'coffee', 'tea', 'energy drink', 'sports drink',
    'yogurt', 'sauce', 'condiment', 'snack', 'candy', 'chocolate',
    'electronics', 'phone', 'computer', 'battery', 'cable', 'wire',
    'clothing', 'fabric', 'textile', 'shoe', 'hat', 'bag',
    'furniture', 'wood', 'chair', 'table', 'desk', 'shelf',
    'toy', 'game', 'book', 'magazine', 'newspaper', 'document',
    'spectacles', 'glasses', 'eyeglasses', 'jar', 'cardboard', 'box',
    'tin', 'can', 'tire', 'rubber', 'paint', 'battery', 'ceramic',
    'plate', 'dish', 'bowl', 'styrofoam', 'polystyrene',
    // Eco-friendly items
    'reusable', 'stainless', 'steel', 'bamboo', 'canvas', 'tote',
    'ceramic', 'mug', 'tumbler', 'utensils', 'cutlery', 'fork', 'spoon', 'knife',
    'solar', 'powered', 'eco', 'friendly', 'sustainable', 'green',
    'compostable', 'biodegradable', 'organic', 'natural', 'plant',
    'hemp', 'cotton', 'organic', 'recycled', 'upcycled',
    // Reusable plastic items
    'bottle', 'container', 'tumbler', 'mug', 'cup', 'drinkware',
    'sports', 'gym', 'fitness', 'hydration', 'water', 'drink',
    // Additional eco-friendly items
    'cloth', 'napkin', 'bag', 'shopping', 'toothbrush', 'charger',
    'compost', 'bin', 'led', 'light', 'bulb', 'notebook', 'coffee',
    'straw', 'metal', 'clothing', 'trash', 'bicycle', 'electric',
    'panels', 'beeswax', 'wraps', 'glass', 'jars', 'wool', 'dryer',
    'balls', 'hand', 'crank', 'flashlight', 'detergent', 'plant',
    'based', 'produce', 'fruits', 'vegetables', 'refrigerator',
    'energy', 'efficient', 'laundry', 'powder', 'secondhand', 'books',
    'phone', 'case', 'rainwater', 'barrel', 'wooden', 'comb', 'soap',
    'appliances', 'media', 'electronics'
  ];

  return labels.filter((label: any) => {
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
    'plastic': ['plastic', 'bottle', 'container', 'bag', 'cup', 'lid', 'tumbler', 'mug', 'drinkware', 'styrofoam', 'polystyrene'],
    'glass': ['glass', 'bottle', 'jar', 'container'],
    'metal': ['metal', 'aluminum', 'steel', 'tin', 'can', 'container', 'stainless'],
    'paper': ['paper', 'cardboard', 'box', 'newspaper', 'magazine', 'book', 'notebook'],
    'fabric': ['fabric', 'textile', 'clothing', 'cloth', 'cotton', 'wool', 'canvas', 'tote', 'napkin', 'organic'],
    'wood': ['wood', 'wooden', 'furniture', 'chair', 'table', 'desk', 'bamboo', 'comb'],
    'electronics': ['electronics', 'phone', 'computer', 'battery', 'cable', 'charger', 'flashlight', 'led', 'light', 'bulb'],
    'ceramic': ['ceramic', 'pottery', 'dish', 'plate', 'bowl', 'mug', 'container'],
    'rubber': ['rubber', 'tire', 'shoe', 'boot', 'wheel'],
    'foam': ['foam', 'styrofoam', 'polystyrene', 'cushion'],
    'tin': ['tin', 'can', 'container'],
    'cardboard': ['cardboard', 'box', 'packaging'],
    'battery': ['battery', 'batteries', 'disposable'],
    'paint': ['paint', 'coating'],
    'spectacles': ['spectacles', 'glasses', 'eyeglasses', 'optical'],
    // Eco-friendly materials
    'stainless steel': ['stainless', 'steel', 'reusable', 'bottle', 'tumbler', 'mug'],
    'bamboo': ['bamboo', 'utensils', 'cutlery', 'fork', 'spoon', 'knife', 'toothbrush', 'comb'],
    'canvas': ['canvas', 'tote', 'bag', 'cotton'],
    'compostable': ['compostable', 'biodegradable', 'plant', 'organic', 'natural'],
    'hemp': ['hemp', 'organic', 'natural', 'fabric'],
    'solar': ['solar', 'powered', 'eco', 'friendly', 'sustainable'],
    'beeswax': ['beeswax', 'wax', 'natural'],
    'liquid': ['liquid', 'detergent', 'soap', 'shampoo'],
    'powder': ['powder', 'laundry', 'detergent'],
    'mixed materials': ['mixed', 'materials', 'appliances', 'refrigerator', 'phone', 'case']
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
