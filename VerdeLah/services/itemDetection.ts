// Item Detection Service
// This service detects items in an image and returns a DetectedItem object
// It uses AWS Rekognition to detect the items and returns a DetectedItem object
// It also uses a mock database to return a DetectedItem object if the image is not detected

export interface DetectedItem {
  id: string;
  name: string;
  category: string;
  confidence: number;
  material: string;
  recyclable: boolean;
  recyclingInstructions: string;
  ecoAlternatives: EcoAlternative[];
  environmentalImpact: EnvironmentalImpact;
}

export interface EcoAlternative {
  name: string;
  description: string;
  carbonFootprintReduction: number; // percentage
  costComparison: 'cheaper' | 'similar' | 'more_expensive';
  availability: 'common' | 'moderate' | 'rare';
}

export interface EnvironmentalImpact {
  carbonFootprint: number; // kg CO2 equivalent
  waterUsage: number; // liters
  biodegradability: 'biodegradable' | 'slow_biodegradable' | 'non_biodegradable';
  recyclability: 'highly_recyclable' | 'moderately_recyclable' | 'difficult_to_recycle' | 'not_recyclable';
}

// Mock database of items with recycling information
export const ITEM_DATABASE: DetectedItem[] = [
  {
    id: 'plastic-bottle-1',
    name: 'Plastic Water Bottle',
    category: 'Beverage Container',
    confidence: 0.95,
    material: 'PET Plastic',
    recyclable: true,
    recyclingInstructions: 'Remove cap and label. Rinse clean. Place in blue recycling bin. Cap can be recycled separately.',
    ecoAlternatives: [
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Reusable, durable, and keeps drinks cold/hot for hours',
        carbonFootprintReduction: 85,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Glass Water Bottle',
        description: 'Chemical-free, easy to clean, and fully recyclable',
        carbonFootprintReduction: 70,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.15,
      waterUsage: 1.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'aluminum-can-1',
    name: 'Aluminum Can',
    category: 'Beverage Container',
    confidence: 0.92,
    material: 'Aluminum',
    recyclable: true,
    recyclingInstructions: 'Empty completely. Rinse if needed. Place in blue recycling bin. Aluminum is infinitely recyclable!',
    ecoAlternatives: [
      {
        name: 'Stainless Steel Tumbler',
        description: 'Perfect for coffee, tea, or cold beverages on the go',
        carbonFootprintReduction: 90,
        costComparison: 'more_expensive',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.12,
      waterUsage: 0.8,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'cardboard-box-1',
    name: 'Cardboard Box',
    category: 'Packaging',
    confidence: 0.88,
    material: 'Cardboard',
    recyclable: true,
    recyclingInstructions: 'Remove any tape or labels. Flatten the box. Place in blue recycling bin. Keep dry.',
    ecoAlternatives: [
      {
        name: 'Reusable Storage Bins',
        description: 'Plastic or fabric bins that can be used for years',
        carbonFootprintReduction: 75,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Biodegradable Packaging',
        description: 'Made from plant-based materials that decompose naturally',
        carbonFootprintReduction: 60,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.08,
      waterUsage: 2.0,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'glass-bottle-1',
    name: 'Glass Bottle',
    category: 'Beverage Container',
    confidence: 0.90,
    material: 'Glass',
    recyclable: true,
    recyclingInstructions: 'Remove cap and label. Rinse clean. Place in blue recycling bin. Glass is infinitely recyclable!',
    ecoAlternatives: [
      {
        name: 'Reusable Glass Bottles',
        description: 'Keep and reuse glass bottles for homemade drinks',
        carbonFootprintReduction: 80,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.20,
      waterUsage: 1.2,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'plastic-bag-1',
    name: 'Plastic Bag',
    category: 'Packaging',
    confidence: 0.85,
    material: 'LDPE Plastic',
    recyclable: false,
    recyclingInstructions: 'Cannot be recycled in regular bins. Take to special plastic bag collection points at supermarkets.',
    ecoAlternatives: [
      {
        name: 'Reusable Shopping Bags',
        description: 'Canvas, cotton, or recycled plastic bags for shopping',
        carbonFootprintReduction: 95,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Biodegradable Bags',
        description: 'Made from plant starch, breaks down naturally',
        carbonFootprintReduction: 70,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 0.3,
      biodegradability: 'non_biodegradable',
      recyclability: 'difficult_to_recycle'
    }
  },
  {
    id: 'styrofoam-1',
    name: 'Styrofoam Container',
    category: 'Food Packaging',
    confidence: 0.87,
    material: 'Polystyrene',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Check for specialized polystyrene recycling programs in your area.',
    ecoAlternatives: [
      {
        name: 'Biodegradable Food Containers',
        description: 'Made from bamboo, sugarcane, or other plant materials',
        carbonFootprintReduction: 80,
        costComparison: 'more_expensive',
        availability: 'moderate'
      },
      {
        name: 'Reusable Food Containers',
        description: 'Glass or stainless steel containers for takeout',
        carbonFootprintReduction: 90,
        costComparison: 'more_expensive',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.25,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'not_recyclable'
    }
  },
  // Environmentally Friendly Items
  {
    id: 'stainless-steel-bottle-1',
    name: 'Stainless Steel Water Bottle',
    category: 'Eco-Friendly Container',
    confidence: 0.95,
    material: 'Stainless Steel',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of disposing. When it reaches end of life, it can be recycled as metal.',
    ecoAlternatives: [
      {
        name: 'Glass Water Bottle',
        description: 'Chemical-free alternative with similar benefits',
        carbonFootprintReduction: 5,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Bamboo Water Bottle',
        description: 'Biodegradable and sustainable option',
        carbonFootprintReduction: 10,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.02,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'reusable-coffee-cup-1',
    name: 'Reusable Coffee Cup',
    category: 'Eco-Friendly Container',
    confidence: 0.90,
    material: 'Ceramic/Stainless Steel',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it to reduce waste. When it reaches end of life, it can be recycled.',
    ecoAlternatives: [
      {
        name: 'Bamboo Coffee Cup',
        description: 'Biodegradable and lightweight option',
        carbonFootprintReduction: 15,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.03,
      waterUsage: 0.2,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'canvas-tote-bag-1',
    name: 'Canvas Tote Bag',
    category: 'Eco-Friendly Accessory',
    confidence: 0.88,
    material: 'Cotton Canvas',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of plastic bags. When worn out, it can be composted or recycled as textile.',
    ecoAlternatives: [
      {
        name: 'Hemp Tote Bag',
        description: 'Even more sustainable with hemp fiber',
        carbonFootprintReduction: 20,
        costComparison: 'more_expensive',
        availability: 'moderate'
      },
      {
        name: 'Recycled Plastic Tote',
        description: 'Made from recycled plastic bottles',
        carbonFootprintReduction: 30,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 2.0,
      biodegradability: 'biodegradable',
      recyclability: 'moderately_recyclable'
    }
  },
  {
    id: 'bamboo-utensils-1',
    name: 'Bamboo Utensils Set',
    category: 'Eco-Friendly Kitchenware',
    confidence: 0.92,
    material: 'Bamboo',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of disposable utensils. When worn out, it can be composted.',
    ecoAlternatives: [
      {
        name: 'Stainless Steel Utensils',
        description: 'Durable and long-lasting alternative',
        carbonFootprintReduction: 5,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.01,
      waterUsage: 0.1,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'solar-powered-device-1',
    name: 'Solar-Powered Device',
    category: 'Eco-Friendly Electronics',
    confidence: 0.85,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is an eco-friendly device! Keep using it to reduce energy consumption. When it reaches end of life, take to electronic waste recycling center.',
    ecoAlternatives: [
      {
        name: 'Hand-Cranked Device',
        description: 'No battery or charging required',
        carbonFootprintReduction: 40,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'moderately_recyclable'
    }
  },
  {
    id: 'compostable-container-1',
    name: 'Compostable Food Container',
    category: 'Eco-Friendly Packaging',
    confidence: 0.87,
    material: 'Plant-Based Materials',
    recyclable: true,
    recyclingInstructions: 'This is compostable! You can compost it at home or in commercial composting facilities. It will break down naturally.',
    ecoAlternatives: [
      {
        name: 'Reusable Glass Container',
        description: 'Durable and infinitely reusable',
        carbonFootprintReduction: 60,
        costComparison: 'more_expensive',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.02,
      waterUsage: 0.3,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  // Additional Recyclable Items
  {
    id: 'spectacles-1',
    name: 'Eyeglasses/Spectacles',
    category: 'Personal Accessories',
    confidence: 0.90,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'Donate to charity or take to optical stores for recycling. Many stores accept old glasses for donation to those in need.',
    ecoAlternatives: [
      {
        name: 'Repair and Maintain',
        description: 'Keep your current glasses longer with proper maintenance',
        carbonFootprintReduction: 70,
        costComparison: 'cheaper',
        availability: 'common'
      },
      {
        name: 'Buy Second-hand',
        description: 'Purchase pre-owned frames and get new lenses fitted',
        carbonFootprintReduction: 60,
        costComparison: 'cheaper',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.8,
      waterUsage: 2.0,
      biodegradability: 'non_biodegradable',
      recyclability: 'moderately_recyclable'
    }
  },
  {
    id: 'glass-jar-1',
    name: 'Glass Jar',
    category: 'Food Container',
    confidence: 0.95,
    material: 'Glass',
    recyclable: true,
    recyclingInstructions: 'Remove lid and label. Rinse clean. Place in blue recycling bin. Glass is infinitely recyclable!',
    ecoAlternatives: [
      {
        name: 'Reuse as Storage',
        description: 'Keep and reuse for storing food, crafts, or organizing',
        carbonFootprintReduction: 90,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.18,
      waterUsage: 1.0,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'cardboard-box-1',
    name: 'Cardboard Box',
    category: 'Packaging',
    confidence: 0.92,
    material: 'Cardboard',
    recyclable: true,
    recyclingInstructions: 'Remove tape and labels. Flatten to save space. Place in blue recycling bin.',
    ecoAlternatives: [
      {
        name: 'Reuse for Storage',
        description: 'Keep for organizing, moving, or craft projects',
        carbonFootprintReduction: 85,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.06,
      waterUsage: 1.5,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'tin-can-1',
    name: 'Tin Can',
    category: 'Food Container',
    confidence: 0.88,
    material: 'Tin',
    recyclable: true,
    recyclingInstructions: 'Empty completely. Rinse clean. Remove label if possible. Place in blue recycling bin.',
    ecoAlternatives: [
      {
        name: 'Fresh Food',
        description: 'Choose fresh fruits and vegetables over canned goods',
        carbonFootprintReduction: 40,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.14,
      waterUsage: 0.9,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'newspaper-1',
    name: 'Newspaper',
    category: 'Paper Product',
    confidence: 0.90,
    material: 'Paper',
    recyclable: true,
    recyclingInstructions: 'Keep dry and clean. Place in blue recycling bin. Can also be used for composting.',
    ecoAlternatives: [
      {
        name: 'Digital News',
        description: 'Read news online or through apps',
        carbonFootprintReduction: 95,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.04,
      waterUsage: 1.2,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'magazine-1',
    name: 'Magazine',
    category: 'Paper Product',
    confidence: 0.88,
    material: 'Paper',
    recyclable: true,
    recyclingInstructions: 'Remove any plastic wrapping. Place in blue recycling bin. Consider donating to libraries or waiting rooms.',
    ecoAlternatives: [
      {
        name: 'Digital Subscriptions',
        description: 'Subscribe to digital versions of magazines',
        carbonFootprintReduction: 90,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 1.3,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  // Additional Non-Recyclable Items
  {
    id: 'styrofoam-cup-1',
    name: 'Styrofoam Cup',
    category: 'Disposable Container',
    confidence: 0.85,
    material: 'Polystyrene',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Check for specialized polystyrene recycling programs in your area.',
    ecoAlternatives: [
      {
        name: 'Reusable Coffee Cup',
        description: 'Bring your own ceramic or stainless steel cup',
        carbonFootprintReduction: 95,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Compostable Cup',
        description: 'Choose plant-based compostable alternatives',
        carbonFootprintReduction: 80,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.3,
      waterUsage: 0.4,
      biodegradability: 'non_biodegradable',
      recyclability: 'not_recyclable'
    }
  },
  {
    id: 'ceramic-dish-1',
    name: 'Ceramic Dish/Plate',
    category: 'Kitchenware',
    confidence: 0.90,
    material: 'Ceramic',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Donate to charity if in good condition, or dispose in general waste.',
    ecoAlternatives: [
      {
        name: 'Repair if Possible',
        description: 'Use ceramic repair kits for minor chips and cracks',
        carbonFootprintReduction: 70,
        costComparison: 'cheaper',
        availability: 'moderate'
      },
      {
        name: 'Buy Second-hand',
        description: 'Purchase pre-owned ceramic dishes',
        carbonFootprintReduction: 60,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.4,
      waterUsage: 1.8,
      biodegradability: 'non_biodegradable',
      recyclability: 'not_recyclable'
    }
  },
  {
    id: 'rubber-tire-1',
    name: 'Rubber Tire',
    category: 'Automotive',
    confidence: 0.95,
    material: 'Rubber',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Take to tire recycling centers or automotive shops. Many offer tire disposal services.',
    ecoAlternatives: [
      {
        name: 'Retread Tires',
        description: 'Choose retreaded tires when possible',
        carbonFootprintReduction: 50,
        costComparison: 'cheaper',
        availability: 'moderate'
      },
      {
        name: 'Eco-Friendly Tires',
        description: 'Look for tires made with sustainable materials',
        carbonFootprintReduction: 30,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 2.5,
      waterUsage: 3.0,
      biodegradability: 'non_biodegradable',
      recyclability: 'difficult_to_recycle'
    }
  },
  {
    id: 'paint-can-1',
    name: 'Paint Can',
    category: 'Hazardous Material',
    confidence: 0.85,
    material: 'Mixed Materials',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Take to hazardous waste collection centers. Never pour paint down drains.',
    ecoAlternatives: [
      {
        name: 'Water-Based Paints',
        description: 'Choose low-VOC or natural paints',
        carbonFootprintReduction: 40,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Donate Unused Paint',
        description: 'Give leftover paint to community projects or neighbors',
        carbonFootprintReduction: 100,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 1.2,
      waterUsage: 2.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'not_recyclable'
    }
  },
  {
    id: 'battery-1',
    name: 'Battery',
    category: 'Electronics',
    confidence: 0.92,
    material: 'Mixed Materials',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Take to battery collection points at electronics stores or recycling centers.',
    ecoAlternatives: [
      {
        name: 'Rechargeable Batteries',
        description: 'Use rechargeable batteries instead of disposable ones',
        carbonFootprintReduction: 80,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Solar-Powered Devices',
        description: 'Choose devices that can be charged with solar power',
        carbonFootprintReduction: 90,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.8,
      waterUsage: 1.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'difficult_to_recycle'
    }
  },
  {
    id: 'plastic-bag-1',
    name: 'Plastic Bag',
    category: 'Packaging',
    confidence: 0.90,
    material: 'Plastic',
    recyclable: true,
    recyclingInstructions: 'Clean and dry. Take to grocery stores with plastic bag collection bins. Some areas accept them in blue recycling bins.',
    ecoAlternatives: [
      {
        name: 'Reusable Shopping Bags',
        description: 'Canvas, cotton, or mesh bags for shopping',
        carbonFootprintReduction: 95,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Paper Bags',
        description: 'Biodegradable alternative for single use',
        carbonFootprintReduction: 60,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.02,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'moderately_recyclable'
    }
  },
  {
    id: 'smartphone-1',
    name: 'Smartphone',
    category: 'Electronics',
    confidence: 0.95,
    material: 'Mixed Materials',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Take to electronic waste collection centers or return to manufacturer. Many stores offer trade-in programs.',
    ecoAlternatives: [
      {
        name: 'Repair and Maintain',
        description: 'Extend phone life with proper care and repairs',
        carbonFootprintReduction: 70,
        costComparison: 'cheaper',
        availability: 'common'
      },
      {
        name: 'Refurbished Phone',
        description: 'Buy certified refurbished devices',
        carbonFootprintReduction: 50,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 3.2,
      waterUsage: 4.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'difficult_to_recycle'
    }
  },
  {
    id: 'laptop-1',
    name: 'Laptop Computer',
    category: 'Electronics',
    confidence: 0.92,
    material: 'Mixed Materials',
    recyclable: false,
    recyclingInstructions: 'Not recyclable in regular bins. Take to electronic waste collection centers or return to manufacturer. Many stores offer trade-in programs.',
    ecoAlternatives: [
      {
        name: 'Repair and Upgrade',
        description: 'Extend laptop life with repairs and upgrades',
        carbonFootprintReduction: 80,
        costComparison: 'cheaper',
        availability: 'moderate'
      },
      {
        name: 'Refurbished Laptop',
        description: 'Buy certified refurbished devices',
        carbonFootprintReduction: 60,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 4.8,
      waterUsage: 6.2,
      biodegradability: 'non_biodegradable',
      recyclability: 'difficult_to_recycle'
    }
  },
  {
    id: 'reusable-plastic-bottle-1',
    name: 'Reusable Plastic Water Bottle',
    category: 'Eco-Friendly Container',
    confidence: 0.90,
    material: 'Plastic',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of disposable bottles. When it reaches end of life, it can be recycled as plastic.',
    ecoAlternatives: [
      {
        name: 'Stainless Steel Bottle',
        description: 'More durable and chemical-free alternative',
        carbonFootprintReduction: 15,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Glass Water Bottle',
        description: 'Chemical-free and fully recyclable',
        carbonFootprintReduction: 10,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 0.2,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'reusable-plastic-container-1',
    name: 'Reusable Plastic Container',
    category: 'Eco-Friendly Container',
    confidence: 0.88,
    material: 'Plastic',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it for food storage and meal prep. When it reaches end of life, it can be recycled as plastic.',
    ecoAlternatives: [
      {
        name: 'Glass Containers',
        description: 'Chemical-free and infinitely recyclable',
        carbonFootprintReduction: 20,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Stainless Steel Containers',
        description: 'Durable and long-lasting alternative',
        carbonFootprintReduction: 25,
        costComparison: 'more_expensive',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.08,
      waterUsage: 0.3,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  // 100 Environmentally Friendly Items
  {
    id: 'stainless-steel-bottle-1',
    name: 'Reusable Water Bottle (Stainless Steel)',
    category: 'Eco-Friendly Container',
    confidence: 0.95,
    material: 'Stainless Steel',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of disposable bottles. When it reaches end of life, it can be recycled as metal.',
    ecoAlternatives: [
      {
        name: 'Glass Water Bottle',
        description: 'Chemical-free and fully recyclable',
        carbonFootprintReduction: 5,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Bamboo Water Bottle',
        description: 'Biodegradable and sustainable',
        carbonFootprintReduction: 10,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.02,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'cloth-shopping-bag-1',
    name: 'Cloth Shopping Bag',
    category: 'Eco-Friendly Container',
    confidence: 0.92,
    material: 'Fabric',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it for shopping instead of plastic bags. When worn out, it can be composted or recycled as fabric.',
    ecoAlternatives: [
      {
        name: 'Jute Shopping Bag',
        description: 'More durable and biodegradable',
        carbonFootprintReduction: 15,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Mesh Produce Bags',
        description: 'Lightweight alternative for produce',
        carbonFootprintReduction: 20,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 0.2,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'bamboo-toothbrush-1',
    name: 'Bamboo Toothbrush',
    category: 'Eco-Friendly Personal Care',
    confidence: 0.90,
    material: 'Bamboo',
    recyclable: true,
    recyclingInstructions: 'This is a biodegradable item! The bamboo handle can be composted. Remove the bristles (usually nylon) before composting.',
    ecoAlternatives: [
      {
        name: 'Electric Toothbrush',
        description: 'More effective cleaning, longer lasting',
        carbonFootprintReduction: 30,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Toothbrush with Replaceable Head',
        description: 'Reduces waste by replacing only the head',
        carbonFootprintReduction: 25,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.01,
      waterUsage: 0.05,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'solar-charger-1',
    name: 'Solar-Powered Charger',
    category: 'Eco-Friendly Electronics',
    confidence: 0.88,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is a sustainable electronic device! When it reaches end of life, take it to electronic waste collection centers for proper recycling.',
    ecoAlternatives: [
      {
        name: 'Hand-Crank Charger',
        description: 'No battery needed, completely manual',
        carbonFootprintReduction: 40,
        costComparison: 'cheaper',
        availability: 'moderate'
      },
      {
        name: 'Wind-Up Charger',
        description: 'Kinetic energy charging alternative',
        carbonFootprintReduction: 35,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterUsage: 0.3,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'compost-bin-1',
    name: 'Compost Bin',
    category: 'Eco-Friendly Container',
    confidence: 0.85,
    material: 'Plastic',
    recyclable: true,
    recyclingInstructions: 'This is a sustainable item! Keep using it for composting organic waste. When it reaches end of life, it can be recycled as plastic.',
    ecoAlternatives: [
      {
        name: 'Wooden Compost Bin',
        description: 'More natural and biodegradable',
        carbonFootprintReduction: 20,
        costComparison: 'more_expensive',
        availability: 'moderate'
      },
      {
        name: 'Metal Compost Bin',
        description: 'More durable and fully recyclable',
        carbonFootprintReduction: 15,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.2,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'led-light-bulb-1',
    name: 'LED Light Bulb',
    category: 'Eco-Friendly Electronics',
    confidence: 0.93,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is an energy-efficient item! When it reaches end of life, take it to electronic waste collection centers for proper recycling.',
    ecoAlternatives: [
      {
        name: 'Smart LED Bulb',
        description: 'More efficient with smart controls',
        carbonFootprintReduction: 25,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Solar LED Bulb',
        description: 'Completely renewable energy powered',
        carbonFootprintReduction: 50,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'recycled-paper-notebook-1',
    name: 'Recycled Paper Notebook',
    category: 'Eco-Friendly Stationery',
    confidence: 0.87,
    material: 'Paper',
    recyclable: true,
    recyclingInstructions: 'This is made from recycled materials! When finished, it can be recycled again as paper.',
    ecoAlternatives: [
      {
        name: 'Digital Notebook',
        description: 'Completely paperless alternative',
        carbonFootprintReduction: 80,
        costComparison: 'cheaper',
        availability: 'common'
      },
      {
        name: 'Stone Paper Notebook',
        description: 'Made from stone, not trees',
        carbonFootprintReduction: 60,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterUsage: 0.3,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'reusable-coffee-cup-1',
    name: 'Reusable Coffee Cup',
    category: 'Eco-Friendly Container',
    confidence: 0.91,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of disposable cups. When it reaches end of life, it can be recycled.',
    ecoAlternatives: [
      {
        name: 'Ceramic Coffee Cup',
        description: 'More durable and chemical-free',
        carbonFootprintReduction: 20,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Bamboo Coffee Cup',
        description: 'Biodegradable and sustainable',
        carbonFootprintReduction: 25,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.03,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'metal-straw-1',
    name: 'Metal Straw',
    category: 'Eco-Friendly Personal Care',
    confidence: 0.89,
    material: 'Metal',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of plastic straws. When it reaches end of life, it can be recycled as metal.',
    ecoAlternatives: [
      {
        name: 'Bamboo Straw',
        description: 'Biodegradable and natural',
        carbonFootprintReduction: 15,
        costComparison: 'cheaper',
        availability: 'common'
      },
      {
        name: 'Glass Straw',
        description: 'Chemical-free and fully recyclable',
        carbonFootprintReduction: 10,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.01,
      waterUsage: 0.05,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'cloth-napkin-1',
    name: 'Cloth Napkin',
    category: 'Eco-Friendly Textile',
    confidence: 0.86,
    material: 'Fabric',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of paper napkins. When worn out, it can be composted or recycled as fabric.',
    ecoAlternatives: [
      {
        name: 'Bamboo Napkins',
        description: 'More absorbent and biodegradable',
        carbonFootprintReduction: 20,
        costComparison: 'similar',
        availability: 'moderate'
      },
      {
        name: 'Hemp Napkins',
        description: 'Most sustainable fabric option',
        carbonFootprintReduction: 25,
        costComparison: 'more_expensive',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.02,
      waterUsage: 0.1,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'organic-cotton-clothing-1',
    name: 'Organic Cotton Clothing',
    category: 'Eco-Friendly Textile',
    confidence: 0.88,
    material: 'Fabric',
    recyclable: true,
    recyclingInstructions: 'This is made from organic cotton! When worn out, it can be composted or recycled as fabric.',
    ecoAlternatives: [
      {
        name: 'Hemp Clothing',
        description: 'More sustainable and durable',
        carbonFootprintReduction: 30,
        costComparison: 'more_expensive',
        availability: 'moderate'
      },
      {
        name: 'Recycled Cotton Clothing',
        description: 'Made from recycled materials',
        carbonFootprintReduction: 25,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.3,
      waterUsage: 0.8,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'biodegradable-trash-bags-1',
    name: 'Biodegradable Trash Bags',
    category: 'Eco-Friendly Container',
    confidence: 0.84,
    material: 'Biodegradable Plastic',
    recyclable: true,
    recyclingInstructions: 'These are biodegradable bags! They will break down naturally in compost or landfill conditions.',
    ecoAlternatives: [
      {
        name: 'Compostable Bags',
        description: 'Fully compostable in industrial facilities',
        carbonFootprintReduction: 40,
        costComparison: 'more_expensive',
        availability: 'moderate'
      },
      {
        name: 'Reusable Trash Cans',
        description: 'Eliminate bag waste entirely',
        carbonFootprintReduction: 60,
        costComparison: 'more_expensive',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterUsage: 0.2,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'electric-bicycle-1',
    name: 'Electric Bicycle',
    category: 'Eco-Friendly Transportation',
    confidence: 0.92,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is a sustainable transportation option! When it reaches end of life, take it to electronic waste collection centers for proper recycling.',
    ecoAlternatives: [
      {
        name: 'Regular Bicycle',
        description: 'No battery needed, completely human-powered',
        carbonFootprintReduction: 50,
        costComparison: 'cheaper',
        availability: 'common'
      },
      {
        name: 'Public Transportation',
        description: 'Shared transportation reduces individual impact',
        carbonFootprintReduction: 70,
        costComparison: 'cheaper',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.2,
      waterUsage: 0.5,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'solar-panels-1',
    name: 'Solar Panels',
    category: 'Eco-Friendly Energy',
    confidence: 0.95,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is a renewable energy source! When it reaches end of life, take it to electronic waste collection centers for proper recycling.',
    ecoAlternatives: [
      {
        name: 'Wind Turbine',
        description: 'Alternative renewable energy source',
        carbonFootprintReduction: 30,
        costComparison: 'similar',
        availability: 'moderate'
      },
      {
        name: 'Community Solar',
        description: 'Shared solar energy program',
        carbonFootprintReduction: 20,
        costComparison: 'cheaper',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterUsage: 0.2,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'beeswax-wraps-1',
    name: 'Beeswax Wraps',
    category: 'Eco-Friendly Container',
    confidence: 0.87,
    material: 'Beeswax',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of plastic wrap. When worn out, it can be composted.',
    ecoAlternatives: [
      {
        name: 'Silicone Food Covers',
        description: 'More durable and washable',
        carbonFootprintReduction: 15,
        costComparison: 'more_expensive',
        availability: 'common'
      },
      {
        name: 'Glass Food Storage',
        description: 'Completely reusable and chemical-free',
        carbonFootprintReduction: 25,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.01,
      waterUsage: 0.05,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'recycled-glass-jars-1',
    name: 'Recycled Glass Jars',
    category: 'Eco-Friendly Container',
    confidence: 0.89,
    material: 'Glass',
    recyclable: true,
    recyclingInstructions: 'This is made from recycled glass! It can be recycled again infinitely.',
    ecoAlternatives: [
      {
        name: 'Mason Jars',
        description: 'More durable and reusable',
        carbonFootprintReduction: 20,
        costComparison: 'similar',
        availability: 'common'
      },
      {
        name: 'Stainless Steel Containers',
        description: 'Unbreakable and long-lasting',
        carbonFootprintReduction: 15,
        costComparison: 'more_expensive',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'wool-dryer-balls-1',
    name: 'Wool Dryer Balls',
    category: 'Eco-Friendly Household',
    confidence: 0.85,
    material: 'Wool',
    recyclable: true,
    recyclingInstructions: 'This is a reusable item! Keep using it instead of dryer sheets. When worn out, it can be composted.',
    ecoAlternatives: [
      {
        name: 'Air Drying',
        description: 'Most energy-efficient option',
        carbonFootprintReduction: 80,
        costComparison: 'cheaper',
        availability: 'common'
      },
      {
        name: 'Silicone Dryer Balls',
        description: 'More durable and long-lasting',
        carbonFootprintReduction: 10,
        costComparison: 'similar',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.02,
      waterUsage: 0.1,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'hand-crank-flashlight-1',
    name: 'Hand-Crank Flashlight',
    category: 'Eco-Friendly Electronics',
    confidence: 0.83,
    material: 'Mixed Materials',
    recyclable: true,
    recyclingInstructions: 'This is a sustainable electronic device! When it reaches end of life, take it to electronic waste collection centers for proper recycling.',
    ecoAlternatives: [
      {
        name: 'Solar Flashlight',
        description: 'Charges from sunlight',
        carbonFootprintReduction: 30,
        costComparison: 'similar',
        availability: 'moderate'
      },
      {
        name: 'LED Headlamp',
        description: 'More efficient and hands-free',
        carbonFootprintReduction: 20,
        costComparison: 'similar',
        availability: 'common'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.05,
      waterUsage: 0.1,
      biodegradability: 'non_biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  {
    id: 'plant-based-detergent-1',
    name: 'Plant-Based Detergent',
    category: 'Eco-Friendly Cleaning',
    confidence: 0.86,
    material: 'Liquid',
    recyclable: true,
    recyclingInstructions: 'This is a biodegradable cleaning product! The bottle can be recycled as plastic.',
    ecoAlternatives: [
      {
        name: 'Detergent Sheets',
        description: 'No plastic bottle needed',
        carbonFootprintReduction: 40,
        costComparison: 'similar',
        availability: 'moderate'
      },
      {
        name: 'Homemade Detergent',
        description: 'Make your own with natural ingredients',
        carbonFootprintReduction: 60,
        costComparison: 'cheaper',
        availability: 'moderate'
      }
    ],
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterUsage: 0.3,
      biodegradability: 'biodegradable',
      recyclability: 'highly_recyclable'
    }
  },
  // Additional Eco-Friendly Items (abbreviated for space)
  { id: 'rainwater-barrel-1', name: 'Rainwater Collection Barrel', category: 'Eco-Friendly Water', confidence: 0.88, material: 'Plastic', recyclable: true, recyclingInstructions: 'This is a sustainable water collection system! When it reaches end of life, it can be recycled as plastic.', ecoAlternatives: [{ name: 'Metal Rain Barrel', description: 'More durable and fully recyclable', carbonFootprintReduction: 15, costComparison: 'more_expensive', availability: 'moderate' }], environmentalImpact: { carbonFootprint: 0.3, waterUsage: 0.5, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'wooden-comb-1', name: 'Wooden Comb', category: 'Eco-Friendly Personal Care', confidence: 0.87, material: 'Wood', recyclable: true, recyclingInstructions: 'This is a biodegradable item! When worn out, it can be composted.', ecoAlternatives: [{ name: 'Bamboo Comb', description: 'More sustainable wood option', carbonFootprintReduction: 10, costComparison: 'similar', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.01, waterUsage: 0.05, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'ceramic-food-container-1', name: 'Ceramic Food Container', category: 'Eco-Friendly Container', confidence: 0.90, material: 'Ceramic', recyclable: true, recyclingInstructions: 'This is a reusable item! Keep using it for food storage. When it reaches end of life, it can be recycled as ceramic.', ecoAlternatives: [{ name: 'Glass Food Container', description: 'More transparent and chemical-free', carbonFootprintReduction: 5, costComparison: 'similar', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.1, waterUsage: 0.2, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'biodegradable-soap-1', name: 'Biodegradable Soap', category: 'Eco-Friendly Personal Care', confidence: 0.85, material: 'Liquid', recyclable: true, recyclingInstructions: 'This is a biodegradable cleaning product! The bottle can be recycled as plastic.', ecoAlternatives: [{ name: 'Soap Bars', description: 'No plastic bottle needed', carbonFootprintReduction: 30, costComparison: 'cheaper', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.05, waterUsage: 0.1, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'organic-produce-1', name: 'Organic Fruits and Vegetables', category: 'Eco-Friendly Food', confidence: 0.92, material: 'Organic', recyclable: true, recyclingInstructions: 'This is organic produce! The peels and scraps can be composted.', ecoAlternatives: [{ name: 'Homegrown Produce', description: 'Grow your own organic food', carbonFootprintReduction: 50, costComparison: 'cheaper', availability: 'moderate' }], environmentalImpact: { carbonFootprint: 0.2, waterUsage: 0.5, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'energy-efficient-fridge-1', name: 'Energy-Efficient Refrigerator', category: 'Eco-Friendly Appliances', confidence: 0.94, material: 'Mixed Materials', recyclable: true, recyclingInstructions: 'This is an energy-efficient appliance! When it reaches end of life, take it to electronic waste collection centers for proper recycling.', ecoAlternatives: [{ name: 'Smart Refrigerator', description: 'More efficient with smart controls', carbonFootprintReduction: 20, costComparison: 'more_expensive', availability: 'moderate' }], environmentalImpact: { carbonFootprint: 0.5, waterUsage: 1.0, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'eco-laundry-powder-1', name: 'Eco-Friendly Laundry Powder', category: 'Eco-Friendly Cleaning', confidence: 0.84, material: 'Powder', recyclable: true, recyclingInstructions: 'This is a biodegradable cleaning product! The container can be recycled as plastic.', ecoAlternatives: [{ name: 'Laundry Nuts', description: 'Natural soap nuts for washing', carbonFootprintReduction: 40, costComparison: 'similar', availability: 'moderate' }], environmentalImpact: { carbonFootprint: 0.08, waterUsage: 0.2, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'secondhand-books-1', name: 'Secondhand Books', category: 'Eco-Friendly Media', confidence: 0.89, material: 'Paper', recyclable: true, recyclingInstructions: 'This is a reused item! When finished, it can be donated again or recycled as paper.', ecoAlternatives: [{ name: 'Digital Books', description: 'Completely paperless alternative', carbonFootprintReduction: 70, costComparison: 'cheaper', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.05, waterUsage: 0.1, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'compostable-phone-case-1', name: 'Compostable Phone Case', category: 'Eco-Friendly Electronics', confidence: 0.86, material: 'Biodegradable Plastic', recyclable: true, recyclingInstructions: 'This is a compostable item! It will break down naturally in compost conditions.', ecoAlternatives: [{ name: 'Wooden Phone Case', description: 'Natural and biodegradable', carbonFootprintReduction: 20, costComparison: 'similar', availability: 'moderate' }], environmentalImpact: { carbonFootprint: 0.02, waterUsage: 0.05, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  // Non-Environmentally Friendly Items
  { id: 'single-use-plastic-bottle-1', name: 'Single-Use Plastic Water Bottle', category: 'Non-Eco Container', confidence: 0.95, material: 'Plastic', recyclable: true, recyclingInstructions: 'This is a single-use item that should be avoided. If you must use it, recycle it properly. Consider switching to a reusable bottle.', ecoAlternatives: [{ name: 'Reusable Water Bottle', description: 'Stainless steel or glass alternative', carbonFootprintReduction: 80, costComparison: 'more_expensive', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.3, waterUsage: 0.5, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'plastic-shopping-bag-1', name: 'Plastic Shopping Bag', category: 'Non-Eco Container', confidence: 0.93, material: 'Plastic', recyclable: true, recyclingInstructions: 'This is a single-use item that should be avoided. If you must use it, recycle it properly. Consider switching to reusable bags.', ecoAlternatives: [{ name: 'Cloth Shopping Bag', description: 'Reusable and durable alternative', carbonFootprintReduction: 90, costComparison: 'similar', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.1, waterUsage: 0.2, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'plastic-toothbrush-1', name: 'Plastic Toothbrush', category: 'Non-Eco Personal Care', confidence: 0.91, material: 'Plastic', recyclable: true, recyclingInstructions: 'This is a single-use item that should be avoided. Consider switching to a bamboo toothbrush.', ecoAlternatives: [{ name: 'Bamboo Toothbrush', description: 'Biodegradable and sustainable', carbonFootprintReduction: 70, costComparison: 'similar', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.05, waterUsage: 0.1, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'disposable-batteries-1', name: 'Disposable Batteries', category: 'Non-Eco Electronics', confidence: 0.89, material: 'Mixed Materials', recyclable: true, recyclingInstructions: 'These are single-use items that should be avoided. Take them to battery collection centers for proper recycling.', ecoAlternatives: [{ name: 'Rechargeable Batteries', description: 'Reusable and cost-effective', carbonFootprintReduction: 85, costComparison: 'more_expensive', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.2, waterUsage: 0.3, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'styrofoam-cups-1', name: 'Styrofoam Cups', category: 'Non-Eco Container', confidence: 0.94, material: 'Styrofoam', recyclable: false, recyclingInstructions: 'These are not recyclable and should be avoided. They take hundreds of years to decompose.', ecoAlternatives: [{ name: 'Reusable Coffee Cup', description: 'Stainless steel or ceramic alternative', carbonFootprintReduction: 95, costComparison: 'more_expensive', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.4, waterUsage: 0.6, biodegradability: 'non_biodegradable', recyclability: 'not_recyclable' } },
  { id: 'incandescent-bulb-1', name: 'Incandescent Light Bulb', category: 'Non-Eco Electronics', confidence: 0.92, material: 'Mixed Materials', recyclable: true, recyclingInstructions: 'This is an energy-inefficient item. When it burns out, take it to electronic waste collection centers.', ecoAlternatives: [{ name: 'LED Light Bulb', description: 'Much more energy efficient', carbonFootprintReduction: 80, costComparison: 'more_expensive', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.3, waterUsage: 0.4, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'new-paper-notebook-1', name: 'New Paper Notebook (Non-Recycled)', category: 'Non-Eco Stationery', confidence: 0.88, material: 'Paper', recyclable: true, recyclingInstructions: 'This is made from virgin paper. When finished, it can be recycled as paper.', ecoAlternatives: [{ name: 'Recycled Paper Notebook', description: 'Made from recycled materials', carbonFootprintReduction: 40, costComparison: 'similar', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.2, waterUsage: 0.5, biodegradability: 'biodegradable', recyclability: 'highly_recyclable' } },
  { id: 'disposable-coffee-cups-1', name: 'Disposable Coffee Cups with Plastic Lining', category: 'Non-Eco Container', confidence: 0.96, material: 'Mixed Materials', recyclable: false, recyclingInstructions: 'These are not recyclable due to plastic lining. They should be avoided.', ecoAlternatives: [{ name: 'Reusable Coffee Cup', description: 'Stainless steel or ceramic alternative', carbonFootprintReduction: 90, costComparison: 'more_expensive', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.3, waterUsage: 0.4, biodegradability: 'non_biodegradable', recyclability: 'not_recyclable' } },
  { id: 'plastic-straws-1', name: 'Plastic Straws', category: 'Non-Eco Personal Care', confidence: 0.97, material: 'Plastic', recyclable: true, recyclingInstructions: 'These are single-use items that should be avoided. Consider switching to reusable alternatives.', ecoAlternatives: [{ name: 'Metal Straws', description: 'Reusable and durable', carbonFootprintReduction: 95, costComparison: 'more_expensive', availability: 'common' }], environmentalImpact: { carbonFootprint: 0.02, waterUsage: 0.05, biodegradability: 'non_biodegradable', recyclability: 'highly_recyclable' } }
];

// AWS Rekognition detection function
export async function detectItem(imageUri: string): Promise<DetectedItem | null> {
  try {
    // Check if AWS credentials are available and valid
    const { hasValidCredentials } = await import('./awsConfig');
    
    if (!hasValidCredentials()) {
      return detectItemMock(imageUri);
    }
    
    // Try to use AWS Rekognition with improved polyfills
    try {
      const awsRekognition = await import('./awsRekognition');
      const itemMapping = await import('./itemMapping');
      
      // Check if the functions exist
      if (!awsRekognition.analyzeImageWithRekognition) {
        console.error('analyzeImageWithRekognition function not found in module');
        throw new Error('AWS Rekognition analyzeImageWithRekognition function not properly imported');
      }
      
      if (!awsRekognition.getRelevantLabels) {
        console.error('getRelevantLabels function not found in module');
        throw new Error('AWS Rekognition getRelevantLabels function not properly imported');
      }
      
      if (!itemMapping.mapRekognitionToDetectedItem) {
        console.error('mapRekognitionToDetectedItem function not found in module');
        throw new Error('Item mapping function not properly imported');
      }
      
      // Analyze image with AWS Rekognition
      const rekognitionResult = await awsRekognition.analyzeImageWithRekognition(imageUri);
      
      // Check if labels exist
      if (!rekognitionResult.labels || !Array.isArray(rekognitionResult.labels)) {
        return detectItemMock(imageUri);
      }
      
      // Get relevant labels for recycling detection
      const relevantLabels = awsRekognition.getRelevantLabels(rekognitionResult.labels);
      
      if (relevantLabels.length === 0) {
        return detectItemMock(imageUri);
      }
      
      // Map Rekognition results to our DetectedItem format
      const detectedItem = itemMapping.mapRekognitionToDetectedItem(relevantLabels, imageUri, ITEM_DATABASE);
      
      return detectedItem;
    } catch (awsError) {
      console.error('AWS Rekognition failed, falling back to mock:', awsError);
      return detectItemMock(imageUri);
    }
  } catch (error) {
    console.error('Detection failed, falling back to mock:', error);
    return detectItemMock(imageUri);
  }
}

// Mock detection function (fallback)
async function detectItemMock(imageUri: string): Promise<DetectedItem | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock detection logic - prioritize specific items over generic materials
  // For demo purposes, we'll select items based on common patterns
  const commonItems = [
    'plastic-bag-1', 'single-use-plastic-bottle-1', 'plastic-shopping-bag-1',
    'stainless-steel-bottle-1', 'cloth-shopping-bag-1', 'bamboo-toothbrush-1',
    'reusable-coffee-cup-1', 'metal-straw-1', 'led-light-bulb-1',
    'styrofoam-cups-1', 'incandescent-bulb-1', 'disposable-coffee-cups-1'
  ];
  
  // Select a random common item
  const randomItemId = commonItems[Math.floor(Math.random() * commonItems.length)];
  const detectedItem = ITEM_DATABASE.find(item => item.id === randomItemId);
  
  if (!detectedItem) {
    // Fallback to random selection
    const randomIndex = Math.floor(Math.random() * ITEM_DATABASE.length);
    const fallbackItem = ITEM_DATABASE[randomIndex];
    
    const confidence = Math.max(0.7, Math.min(0.98, fallbackItem.confidence + (Math.random() - 0.5) * 0.2));
    
    return {
      ...fallbackItem,
      confidence: Math.round(confidence * 100) / 100
    };
  }
  
  // Add some randomness to confidence score
  const confidence = Math.max(0.7, Math.min(0.98, detectedItem.confidence + (Math.random() - 0.5) * 0.2));
  
  return {
    ...detectedItem,
    confidence: Math.round(confidence * 100) / 100
  };
}

// Get recycling tips based on material
export function getRecyclingTips(material: string): string[] {
  const tips: { [key: string]: string[] } = {
    'PET Plastic': [
      'Remove all labels and caps before recycling',
      'Rinse containers clean to avoid contamination',
      'Check the recycling number on the bottom',
      'Flatten bottles to save space in recycling bins'
    ],
    'Aluminum': [
      'Aluminum cans are infinitely recyclable',
      'No need to remove labels - they burn off during recycling',
      'Rinse to remove food residue',
      'Aluminum recycling saves 95% of energy compared to new production'
    ],
    'Cardboard': [
      'Remove all tape and labels',
      'Flatten boxes to maximize space',
      'Keep cardboard dry - wet cardboard cannot be recycled',
      'Break down large boxes into smaller pieces'
    ],
    'Glass': [
      'Glass is infinitely recyclable without quality loss',
      'Remove caps and labels before recycling',
      'Rinse containers clean',
      'Don\'t worry about broken glass - it can still be recycled'
    ],
    'LDPE Plastic': [
      'Check with local recycling programs for acceptance',
      'Clean and dry before recycling',
      'Some programs require special collection',
      'Consider reusing for storage or crafts'
    ],
    'Polystyrene': [
      'Most curbside programs don\'t accept polystyrene',
      'Look for specialized drop-off locations',
      'Consider reusing for packaging or crafts',
      'Best alternative is to avoid polystyrene products'
    ]
  };
  
  return tips[material] || ['Check with your local recycling program for specific instructions.'];
}

// Calculate environmental impact score
export function calculateEnvironmentalScore(item: DetectedItem): number {
  let score = 0;
  
  // Penalty for non-eco-friendly categories
  if (item.category.includes('Non-Eco') || item.category.includes('Single-Use')) {
    score -= 30; // Heavy penalty for non-eco items
  }
  
  // Base score from recyclability
  switch (item.environmentalImpact.recyclability) {
    case 'highly_recyclable':
      score += 40;
      break;
    case 'moderately_recyclable':
      score += 25;
      break;
    case 'difficult_to_recycle':
      score += 10;
      break;
    case 'not_recyclable':
      score += 0;
      break;
  }
  
  // Bonus for biodegradability
  switch (item.environmentalImpact.biodegradability) {
    case 'biodegradable':
      score += 30;
      break;
    case 'slow_biodegradable':
      score += 15;
      break;
    case 'non_biodegradable':
      score += 0;
      break;
  }
  
  // Carbon footprint factor (lower is better) - adjusted to be less harsh
  const carbonScore = Math.max(0, 30 - (item.environmentalImpact.carbonFootprint * 10));
  score += carbonScore;
  
  // Penalty for single-use items
  if (item.recyclingInstructions.toLowerCase().includes('single-use') ||
      item.recyclingInstructions.toLowerCase().includes('disposable') ||
      item.recyclingInstructions.toLowerCase().includes('avoid')) {
    score -= 20; // Penalty for single-use items
  }
  
  // Bonus for reusable items and long-lasting products
  if (item.recyclingInstructions.toLowerCase().includes('reusable') || 
      item.recyclingInstructions.toLowerCase().includes('donate') ||
      item.recyclingInstructions.toLowerCase().includes('repair')) {
    score += 15;
  }
  
  // Bonus for eco-friendly items
  if (item.category.includes('Eco-Friendly') || 
      item.material.includes('Stainless') || 
      item.material.includes('Bamboo') ||
      item.material.includes('Canvas')) {
    score += 20;
  }
  
  // Additional penalty for specific non-eco items
  const nonEcoKeywords = ['plastic bag', 'single-use', 'styrofoam', 'disposable', 'incandescent'];
  if (nonEcoKeywords.some(keyword => item.name.toLowerCase().includes(keyword))) {
    score -= 15;
  }
  
  return Math.min(100, Math.max(0, score));
}