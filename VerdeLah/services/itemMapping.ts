// Item Mapping Service
// This service maps AWS Rekognition results to our app's DetectedItem format

import { DetectedItem, EcoAlternative, EnvironmentalImpact } from './itemDetection';
import { RekognitionLabel } from './awsRekognition';

// Material-specific recycling information
const MATERIAL_DATABASE = {
  plastic: {
    recyclable: true,
    instructions: 'Remove cap and label. Rinse clean. Place in blue recycling bin. Check recycling number on bottom.',
    alternatives: [
      {
        name: 'Stainless Steel Container',
        description: 'Durable, reusable, and keeps contents fresh',
        carbonFootprintReduction: 80,
        costComparison: 'more_expensive' as const,
        availability: 'common' as const
      },
      {
        name: 'Glass Container',
        description: 'Chemical-free, easy to clean, and fully recyclable',
        carbonFootprintReduction: 70,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.15,
      waterUsage: 1.5,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  glass: {
    recyclable: true,
    instructions: 'Remove cap and label. Rinse clean. Place in blue recycling bin. Glass is infinitely recyclable!',
    alternatives: [
      {
        name: 'Reusable Glass Bottles',
        description: 'Keep and reuse glass bottles for homemade drinks',
        carbonFootprintReduction: 85,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.20,
      waterUsage: 1.2,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  metal: {
    recyclable: true,
    instructions: 'Empty completely. Rinse if needed. Place in blue recycling bin. Metal is infinitely recyclable!',
    alternatives: [
      {
        name: 'Stainless Steel Alternative',
        description: 'Durable, long-lasting, and fully recyclable',
        carbonFootprintReduction: 90,
        costComparison: 'more_expensive' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.12,
      waterUsage: 0.8,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  paper: {
    recyclable: true,
    instructions: 'Remove any tape or labels. Keep dry. Place in blue recycling bin. Flatten to save space.',
    alternatives: [
      {
        name: 'Digital Alternatives',
        description: 'Use digital documents, e-books, and online subscriptions',
        carbonFootprintReduction: 95,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      },
      {
        name: 'Reusable Notebooks',
        description: 'Digital notebooks or erasable writing surfaces',
        carbonFootprintReduction: 80,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.08,
      waterUsage: 2.0,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  fabric: {
    recyclable: false,
    instructions: 'Cannot be recycled in regular bins. Donate to charity or take to textile recycling centers.',
    alternatives: [
      {
        name: 'Sustainable Fabrics',
        description: 'Organic cotton, hemp, or recycled polyester',
        carbonFootprintReduction: 60,
        costComparison: 'more_expensive' as const,
        availability: 'moderate' as const
      },
      {
        name: 'Second-hand Clothing',
        description: 'Buy from thrift stores or clothing swaps',
        carbonFootprintReduction: 85,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.30,
      waterUsage: 10.0,
      biodegradability: 'biodegradable' as const,
      recyclability: 'difficult_to_recycle' as const
    }
  },
  electronics: {
    recyclable: false,
    instructions: 'Cannot be recycled in regular bins. Take to electronic waste collection centers or return to manufacturer.',
    alternatives: [
      {
        name: 'Repair and Maintain',
        description: 'Extend device life through proper maintenance and repairs',
        carbonFootprintReduction: 70,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      },
      {
        name: 'Refurbished Electronics',
        description: 'Buy certified refurbished devices',
        carbonFootprintReduction: 50,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 2.5,
      waterUsage: 5.0,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'difficult_to_recycle' as const
    }
  },
  foam: {
    recyclable: false,
    instructions: 'Not recyclable in regular bins. Check for specialized polystyrene recycling programs in your area.',
    alternatives: [
      {
        name: 'Biodegradable Packaging',
        description: 'Made from plant-based materials that decompose naturally',
        carbonFootprintReduction: 80,
        costComparison: 'more_expensive' as const,
        availability: 'moderate' as const
      },
      {
        name: 'Reusable Containers',
        description: 'Glass or stainless steel containers for storage',
        carbonFootprintReduction: 90,
        costComparison: 'more_expensive' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.25,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'not_recyclable' as const
    }
  }
};

/**
 * Map Rekognition labels to a DetectedItem
 * @param labels - Array of Rekognition labels
 * @param imageUri - Original image URI
 * @returns DetectedItem or null if no match found
 */
export function mapRekognitionToDetectedItem(labels: RekognitionLabel[], imageUri: string): DetectedItem | null {
  if (!labels || labels.length === 0) {
    return null;
  }

  // Get the most confident label
  const primaryLabel = labels.reduce((prev, current) => 
    (prev.Confidence > current.Confidence) ? prev : current
  );

  // Determine material type
  const material = determineMaterialType(labels);
  const materialInfo = MATERIAL_DATABASE[material as keyof typeof MATERIAL_DATABASE];

  if (!materialInfo) {
    return null;
  }

  // Generate item name and category
  const itemName = generateItemName(primaryLabel.Name, material);
  const category = generateCategory(primaryLabel.Name, material);

  return {
    id: `rekognition-${Date.now()}`,
    name: itemName,
    category: category,
    confidence: primaryLabel.Confidence / 100, // Convert to 0-1 scale
    material: material.charAt(0).toUpperCase() + material.slice(1),
    recyclable: materialInfo.recyclable,
    recyclingInstructions: materialInfo.instructions,
    ecoAlternatives: materialInfo.alternatives,
    environmentalImpact: materialInfo.impact
  };
}

/**
 * Determine material type from labels
 * @param labels - Array of Rekognition labels
 * @returns Material type string
 */
function determineMaterialType(labels: RekognitionLabel[]): string {
  const materialScores: { [key: string]: number } = {};

  // Score each material based on label matches
  labels.forEach(label => {
    const name = label.Name.toLowerCase();
    const confidence = label.Confidence;

    // Plastic indicators
    if (name.includes('plastic') || name.includes('bottle') || name.includes('container')) {
      materialScores.plastic = (materialScores.plastic || 0) + confidence;
    }

    // Glass indicators
    if (name.includes('glass') || name.includes('jar')) {
      materialScores.glass = (materialScores.glass || 0) + confidence;
    }

    // Metal indicators
    if (name.includes('metal') || name.includes('aluminum') || name.includes('steel') || name.includes('can')) {
      materialScores.metal = (materialScores.metal || 0) + confidence;
    }

    // Paper indicators
    if (name.includes('paper') || name.includes('cardboard') || name.includes('box')) {
      materialScores.paper = (materialScores.paper || 0) + confidence;
    }

    // Fabric indicators
    if (name.includes('fabric') || name.includes('textile') || name.includes('clothing')) {
      materialScores.fabric = (materialScores.fabric || 0) + confidence;
    }

    // Electronics indicators
    if (name.includes('electronics') || name.includes('phone') || name.includes('computer')) {
      materialScores.electronics = (materialScores.electronics || 0) + confidence;
    }

    // Foam indicators
    if (name.includes('foam') || name.includes('styrofoam')) {
      materialScores.foam = (materialScores.foam || 0) + confidence;
    }
  });

  // Return the material with the highest score
  const sortedMaterials = Object.entries(materialScores)
    .sort(([,a], [,b]) => b - a);

  return sortedMaterials.length > 0 ? sortedMaterials[0][0] : 'plastic';
}

/**
 * Generate item name from label and material
 * @param labelName - Primary label name from Rekognition
 * @param material - Detected material type
 * @returns Formatted item name
 */
function generateItemName(labelName: string, material: string): string {
  const materialPrefix = material.charAt(0).toUpperCase() + material.slice(1);
  
  // Clean up the label name
  const cleanLabel = labelName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `${materialPrefix} ${cleanLabel}`;
}

/**
 * Generate category from label and material
 * @param labelName - Primary label name from Rekognition
 * @param material - Detected material type
 * @returns Category string
 */
function generateCategory(labelName: string, material: string): string {
  const name = labelName.toLowerCase();

  if (name.includes('bottle') || name.includes('can') || name.includes('cup')) {
    return 'Beverage Container';
  }
  
  if (name.includes('box') || name.includes('package') || name.includes('bag')) {
    return 'Packaging';
  }
  
  if (name.includes('food') || name.includes('container')) {
    return 'Food Container';
  }
  
  if (name.includes('clothing') || name.includes('fabric')) {
    return 'Textile';
  }
  
  if (name.includes('electronics') || name.includes('phone') || name.includes('computer')) {
    return 'Electronics';
  }
  
  if (name.includes('furniture') || name.includes('chair') || name.includes('table')) {
    return 'Furniture';
  }
  
  return 'General Item';
}
