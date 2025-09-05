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
  },
  // Eco-friendly materials
  'stainless steel': {
    recyclable: true,
    instructions: 'This is a reusable item! Keep using it instead of disposing. When it reaches end of life, it can be recycled as metal.',
    alternatives: [
      {
        name: 'Glass Alternative',
        description: 'Chemical-free alternative with similar benefits',
        carbonFootprintReduction: 5,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.02,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  bamboo: {
    recyclable: true,
    instructions: 'This is a reusable item! Keep using it instead of disposable alternatives. When worn out, it can be composted.',
    alternatives: [
      {
        name: 'Stainless Steel Utensils',
        description: 'Durable and long-lasting alternative',
        carbonFootprintReduction: 5,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.01,
      waterUsage: 0.1,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  canvas: {
    recyclable: true,
    instructions: 'This is a reusable item! Keep using it instead of plastic bags. When worn out, it can be composted or recycled as textile.',
    alternatives: [
      {
        name: 'Hemp Tote Bag',
        description: 'Even more sustainable with hemp fiber',
        carbonFootprintReduction: 20,
        costComparison: 'more_expensive' as const,
        availability: 'moderate' as const
      }
    ],
    impact: {
      carbonFootprint: 0.05,
      waterUsage: 2.0,
      biodegradability: 'biodegradable' as const,
      recyclability: 'moderately_recyclable' as const
    }
  },
  compostable: {
    recyclable: true,
    instructions: 'This is compostable! You can compost it at home or in commercial composting facilities. It will break down naturally.',
    alternatives: [
      {
        name: 'Reusable Glass Container',
        description: 'Durable and infinitely reusable',
        carbonFootprintReduction: 60,
        costComparison: 'more_expensive' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.02,
      waterUsage: 0.3,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  hemp: {
    recyclable: true,
    instructions: 'This is a sustainable item! Keep using it. When worn out, it can be composted or recycled as textile.',
    alternatives: [
      {
        name: 'Organic Cotton',
        description: 'Another sustainable natural fiber option',
        carbonFootprintReduction: 10,
        costComparison: 'similar' as const,
        availability: 'moderate' as const
      }
    ],
    impact: {
      carbonFootprint: 0.03,
      waterUsage: 1.5,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  solar: {
    recyclable: true,
    instructions: 'This is an eco-friendly device! Keep using it to reduce energy consumption. When it reaches end of life, take to electronic waste recycling center.',
    alternatives: [
      {
        name: 'Hand-Cranked Device',
        description: 'No battery or charging required',
        carbonFootprintReduction: 40,
        costComparison: 'similar' as const,
        availability: 'moderate' as const
      }
    ],
    impact: {
      carbonFootprint: 0.1,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'moderately_recyclable' as const
    }
  },
  // Additional materials
  tin: {
    recyclable: true,
    instructions: 'Empty completely. Rinse clean. Remove label if possible. Place in blue recycling bin.',
    alternatives: [
      {
        name: 'Fresh Food',
        description: 'Choose fresh fruits and vegetables over canned goods',
        carbonFootprintReduction: 40,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.14,
      waterUsage: 0.9,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  cardboard: {
    recyclable: true,
    instructions: 'Remove tape and labels. Flatten to save space. Place in blue recycling bin.',
    alternatives: [
      {
        name: 'Reuse for Storage',
        description: 'Keep for organizing, moving, or craft projects',
        carbonFootprintReduction: 85,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.06,
      waterUsage: 1.5,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  battery: {
    recyclable: false,
    instructions: 'Not recyclable in regular bins. Take to battery collection points at electronics stores or recycling centers.',
    alternatives: [
      {
        name: 'Rechargeable Batteries',
        description: 'Use rechargeable batteries instead of disposable ones',
        carbonFootprintReduction: 80,
        costComparison: 'more_expensive' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.8,
      waterUsage: 1.5,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'difficult_to_recycle' as const
    }
  },
  paint: {
    recyclable: false,
    instructions: 'Not recyclable in regular bins. Take to hazardous waste collection centers. Never pour paint down drains.',
    alternatives: [
      {
        name: 'Water-Based Paints',
        description: 'Choose low-VOC or natural paints',
        carbonFootprintReduction: 40,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 1.2,
      waterUsage: 2.5,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'not_recyclable' as const
    }
  },
  spectacles: {
    recyclable: true,
    instructions: 'Donate to charity or take to optical stores for recycling. Many stores accept old glasses for donation to those in need.',
    alternatives: [
      {
        name: 'Repair and Maintain',
        description: 'Keep your current glasses longer with proper maintenance',
        carbonFootprintReduction: 70,
        costComparison: 'cheaper' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.8,
      waterUsage: 2.0,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'moderately_recyclable' as const
    }
  },
  beeswax: {
    recyclable: true,
    instructions: 'This is a biodegradable item! When worn out, it can be composted or recycled as organic material.',
    alternatives: [
      {
        name: 'Silicone Wraps',
        description: 'More durable and washable alternative',
        carbonFootprintReduction: 15,
        costComparison: 'more_expensive' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.01,
      waterUsage: 0.05,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  liquid: {
    recyclable: true,
    instructions: 'This is a liquid product! The container can be recycled as plastic.',
    alternatives: [
      {
        name: 'Solid Alternatives',
        description: 'Bars or powders instead of liquids',
        carbonFootprintReduction: 30,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.1,
      waterUsage: 0.3,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  powder: {
    recyclable: true,
    instructions: 'This is a powder product! The container can be recycled as plastic.',
    alternatives: [
      {
        name: 'Refillable Options',
        description: 'Buy in bulk and refill containers',
        carbonFootprintReduction: 40,
        costComparison: 'cheaper' as const,
        availability: 'moderate' as const
      }
    ],
    impact: {
      carbonFootprint: 0.08,
      waterUsage: 0.2,
      biodegradability: 'biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  },
  'mixed materials': {
    recyclable: true,
    instructions: 'This contains mixed materials! When it reaches end of life, take it to appropriate collection centers for proper recycling.',
    alternatives: [
      {
        name: 'Single Material Alternatives',
        description: 'Choose items made from one recyclable material',
        carbonFootprintReduction: 25,
        costComparison: 'similar' as const,
        availability: 'common' as const
      }
    ],
    impact: {
      carbonFootprint: 0.3,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable' as const,
      recyclability: 'highly_recyclable' as const
    }
  }
};

/**
 * Map Rekognition labels to a DetectedItem
 * @param labels - Array of Rekognition labels
 * @param imageUri - Original image URI
 * @returns DetectedItem or null if no match found
 */
export function mapRekognitionToDetectedItem(labels: RekognitionLabel[], imageUri: string, itemDatabase: DetectedItem[]): DetectedItem | null {
  console.log('mapRekognitionToDetectedItem called with:', labels, 'labels and', itemDatabase, 'items');
  
  if (!labels || labels.length === 0) {
    console.log('No labels provided to mapRekognitionToDetectedItem');
    return null;
  }

  // First, try to find specific items in the database based on labels
  const specificItem = findSpecificItem(labels, itemDatabase);
  if (specificItem) {
    return specificItem;
  }

  // If no specific item found, fall back to generic material detection
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
 * Find specific items in the database based on Rekognition labels
 * @param labels - Array of Rekognition labels
 * @returns DetectedItem or null if no specific item found
 */
function findSpecificItem(labels: RekognitionLabel[], itemDatabase: DetectedItem[]): DetectedItem | null {
  console.log('findSpecificItem called with:', labels.length, 'labels and', itemDatabase.length, 'items in database');
  
  // Create a map of label names to potential items
  const labelToItems: { [key: string]: string[] } = {
    'bag': ['plastic-bag-1', 'plastic-shopping-bag-1', 'cloth-shopping-bag-1'],
    'bottle': ['single-use-plastic-bottle-1', 'stainless-steel-bottle-1', 'reusable-plastic-bottle-1'],
    'cup': ['reusable-coffee-cup-1', 'disposable-coffee-cups-1', 'styrofoam-cups-1'],
    'straw': ['metal-straw-1', 'plastic-straws-1'],
    'toothbrush': ['bamboo-toothbrush-1', 'plastic-toothbrush-1'],
    'light': ['led-light-bulb-1', 'incandescent-bulb-1'],
    'bulb': ['led-light-bulb-1', 'incandescent-bulb-1'],
    'notebook': ['recycled-paper-notebook-1', 'new-paper-notebook-1'],
    'book': ['secondhand-books-1'],
    'clothing': ['organic-cotton-clothing-1'],
    'napkin': ['cloth-napkin-1'],
    'charger': ['solar-charger-1'],
    'bicycle': ['electric-bicycle-1'],
    'panel': ['solar-panels-1'],
    'wrap': ['beeswax-wraps-1'],
    'jar': ['recycled-glass-jars-1'],
    'detergent': ['plant-based-detergent-1', 'eco-laundry-powder-1'],
    'soap': ['biodegradable-soap-1'],
    'produce': ['organic-produce-1'],
    'refrigerator': ['energy-efficient-fridge-1'],
    'phone': ['compostable-phone-case-1'],
    'case': ['compostable-phone-case-1']
  };
  
  // Score each potential item based on label matches
  const itemScores: { [key: string]: number } = {};
  
  labels.forEach(label => {
    const labelName = label.Name.toLowerCase();
    const confidence = label.Confidence;
    
    // Check if this label matches any specific items
    Object.entries(labelToItems).forEach(([keyword, itemIds]) => {
      if (labelName.includes(keyword)) {
        itemIds.forEach(itemId => {
          itemScores[itemId] = (itemScores[itemId] || 0) + confidence;
        });
      }
    });
  });
  
  // Find the item with the highest score
  const bestMatch = Object.entries(itemScores).reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  );
  
  console.log('Item scores:', itemScores);
  console.log('Best match:', bestMatch);
  
  if (bestMatch && bestMatch[1] > 50) { // Minimum confidence threshold
    console.log('Looking for item with ID:', bestMatch[0]);
    const item = itemDatabase.find((item: any) => item.id === bestMatch[0]);
    console.log('Found item:', item ? item.name : 'not found');
    if (item) {
      return {
        ...item,
        confidence: Math.min(0.98, bestMatch[1] / 100)
      };
    }
  }
  
  console.log('No specific item found, returning null');
  return null;
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
    if (name.includes('plastic') || name.includes('bottle') || name.includes('container') || 
        name.includes('tumbler') || name.includes('mug') || name.includes('drinkware')) {
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

    // Electronics indicators - be more specific to avoid generic "electronics" detection
    if (name.includes('phone') || name.includes('computer') || name.includes('laptop') || 
        name.includes('tablet') || name.includes('camera') || name.includes('headphones')) {
      materialScores.electronics = (materialScores.electronics || 0) + confidence;
    }
    
    // Only use generic "electronics" if no other specific material is detected
    if (name.includes('electronics') && !name.includes('phone') && !name.includes('computer') && 
        !name.includes('plastic') && !name.includes('metal') && !name.includes('glass')) {
      materialScores.electronics = (materialScores.electronics || 0) + confidence;
    }

    // Foam indicators
    if (name.includes('foam') || name.includes('styrofoam')) {
      materialScores.foam = (materialScores.foam || 0) + confidence;
    }

    // Tin indicators
    if (name.includes('tin') || name.includes('can')) {
      materialScores.tin = (materialScores.tin || 0) + confidence;
    }

    // Cardboard indicators
    if (name.includes('cardboard') || name.includes('box')) {
      materialScores.cardboard = (materialScores.cardboard || 0) + confidence;
    }

    // Battery indicators
    if (name.includes('battery') || name.includes('batteries')) {
      materialScores.battery = (materialScores.battery || 0) + confidence;
    }

    // Paint indicators
    if (name.includes('paint') || name.includes('coating')) {
      materialScores.paint = (materialScores.paint || 0) + confidence;
    }

    // Spectacles indicators
    if (name.includes('spectacles') || name.includes('glasses') || name.includes('eyeglasses')) {
      materialScores.spectacles = (materialScores.spectacles || 0) + confidence;
    }

    // Eco-friendly material indicators
    if (name.includes('stainless') || name.includes('steel')) {
      materialScores['stainless steel'] = (materialScores['stainless steel'] || 0) + confidence;
    }

    if (name.includes('bamboo')) {
      materialScores.bamboo = (materialScores.bamboo || 0) + confidence;
    }

    if (name.includes('canvas') || name.includes('tote')) {
      materialScores.canvas = (materialScores.canvas || 0) + confidence;
    }

    if (name.includes('compostable') || name.includes('biodegradable') || name.includes('plant')) {
      materialScores.compostable = (materialScores.compostable || 0) + confidence;
    }

    if (name.includes('hemp') || name.includes('organic')) {
      materialScores.hemp = (materialScores.hemp || 0) + confidence;
    }

    if (name.includes('solar') || name.includes('eco') || name.includes('sustainable')) {
      materialScores.solar = (materialScores.solar || 0) + confidence;
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

  // Avoid duplication if label already contains the material name or is exactly the same
  const cleanLabelLower = cleanLabel.toLowerCase();
  const materialLower = material.toLowerCase();
  
  if (cleanLabelLower === materialLower || cleanLabelLower.includes(materialLower)) {
    return cleanLabel;
  }

  // Also check for common synonyms to avoid duplication
  const materialSynonyms: { [key: string]: string[] } = {
    'electronics': ['electronic', 'device', 'gadget', 'phone', 'computer'],
    'plastic': ['plastic', 'polymer', 'bottle', 'container', 'tumbler', 'mug'],
    'metal': ['metal', 'aluminum', 'steel', 'tin'],
    'glass': ['glass', 'bottle', 'jar'],
    'paper': ['paper', 'cardboard'],
    'fabric': ['fabric', 'textile', 'cloth', 'cotton']
  };

  if (materialSynonyms[materialLower]) {
    const hasSynonym = materialSynonyms[materialLower].some(synonym => 
      cleanLabelLower.includes(synonym)
    );
    if (hasSynonym) {
      return cleanLabel;
    }
  }

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

  // Check for reusable items first
  if (name.includes('reusable') || name.includes('tumbler') || name.includes('mug') || 
      (name.includes('bottle') && (name.includes('water') || name.includes('drink')))) {
    return 'Eco-Friendly Container';
  }
  
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

