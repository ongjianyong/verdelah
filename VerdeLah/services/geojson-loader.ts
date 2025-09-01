
export interface RecyclingBin {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  buildingName?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  type: 'mixed';
  hyperlink?: string;
  distance?: number; // Optional distance from user location
  recyclableMaterials?: string[];
  operatingHours?: string;
  accessibility?: string;
  maintenanceStatus?: string;
}

export const loadRecyclingBinsFromGeoJSON = async (): Promise<RecyclingBin[]> => {
  try {
    // For now, use sample data since even the processed file is too large for asset registry
    // TODO: Implement server-side API or chunked loading for full dataset
    console.log('Loading sample recycling bins data...');
    return getSampleRecyclingBins();
  } catch (error) {
    console.error('Error loading bins data:', error);
    return getSampleRecyclingBins();
  }
};

// Sample recycling bins data for Singapore - expanded with more locations
const getSampleRecyclingBins = (): RecyclingBin[] => {
  return [
    // Central Singapore
    {
      id: 'bin-1',
      name: 'Marina Bay Sands Recycling Bin',
      address: '10 Bayfront Avenue',
      postalCode: '018956',
      buildingName: 'Marina Bay Sands',
      location: {
        latitude: 1.2833,
        longitude: 103.8607,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-2',
      name: 'Orchard Road Recycling Bin',
      address: '320 Orchard Road',
      postalCode: '238865',
      buildingName: 'Orchard Gateway',
      location: {
        latitude: 1.3048,
        longitude: 103.8318,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-3',
      name: 'Chinatown Recycling Bin',
      address: '1 Pagoda Street',
      postalCode: '059207',
      buildingName: 'Chinatown Complex',
      location: {
        latitude: 1.2839,
        longitude: 103.8443,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-4',
      name: 'Bugis Recycling Bin',
      address: '200 Victoria Street',
      postalCode: '188021',
      buildingName: 'Bugis Junction',
      location: {
        latitude: 1.3008,
        longitude: 103.8558,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-5',
      name: 'Clarke Quay Recycling Bin',
      address: '3 River Valley Road',
      postalCode: '179024',
      buildingName: 'Clarke Quay',
      location: {
        latitude: 1.2903,
        longitude: 103.8458,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-6',
      name: 'Raffles Place Recycling Bin',
      address: '5 Raffles Place',
      postalCode: '048618',
      buildingName: 'Raffles Place MRT',
      location: {
        latitude: 1.2839,
        longitude: 103.8515,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-7',
      name: 'City Hall Recycling Bin',
      address: '3 St Andrew\'s Road',
      postalCode: '178958',
      buildingName: 'City Hall MRT',
      location: {
        latitude: 1.2931,
        longitude: 103.8521,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-8',
      name: 'Dhoby Ghaut Recycling Bin',
      address: '11 Orchard Road',
      postalCode: '238826',
      buildingName: 'Dhoby Ghaut MRT',
      location: {
        latitude: 1.2990,
        longitude: 103.8458,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    // East Singapore
    {
      id: 'bin-9',
      name: 'Tampines Recycling Bin',
      address: '4 Tampines Central 5',
      postalCode: '529510',
      buildingName: 'Tampines Mall',
      location: {
        latitude: 1.3496,
        longitude: 103.9568,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-10',
      name: 'Bedok Recycling Bin',
      address: '311 New Upper Changi Road',
      postalCode: '467360',
      buildingName: 'Bedok Mall',
      location: {
        latitude: 1.3239,
        longitude: 103.9303,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-11',
      name: 'Pasir Ris Recycling Bin',
      address: '1 Pasir Ris Central Street 3',
      postalCode: '518457',
      buildingName: 'White Sands',
      location: {
        latitude: 1.3731,
        longitude: 103.9493,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    // West Singapore - More bins closer to your location
    {
      id: 'bin-12',
      name: 'Jurong East Recycling Bin',
      address: '50 Jurong Gateway Road',
      postalCode: '608549',
      buildingName: 'JEM Shopping Centre',
      location: {
        latitude: 1.3333,
        longitude: 103.7431,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-13',
      name: 'Boon Lay Recycling Bin',
      address: '1 Jurong West Central 2',
      postalCode: '648886',
      buildingName: 'Jurong Point',
      location: {
        latitude: 1.3396,
        longitude: 103.7058,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-14',
      name: 'Clementi Recycling Bin',
      address: '3155 Commonwealth Avenue West',
      postalCode: '129588',
      buildingName: 'Clementi Mall',
      location: {
        latitude: 1.3158,
        longitude: 103.7651,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-21',
      name: 'Pioneer Recycling Bin',
      address: '31 Jurong West Street 63',
      postalCode: '648310',
      buildingName: 'Pioneer Mall',
      location: {
        latitude: 1.3375,
        longitude: 103.6965,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-22',
      name: 'Lakeside Recycling Bin',
      address: '201 Jurong Gateway Road',
      postalCode: '608431',
      buildingName: 'Lakeside MRT',
      location: {
        latitude: 1.3447,
        longitude: 103.7203,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-23',
      name: 'Chinese Garden Recycling Bin',
      address: '1 Chinese Garden Road',
      postalCode: '619795',
      buildingName: 'Chinese Garden',
      location: {
        latitude: 1.3389,
        longitude: 103.7303,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-24',
      name: 'Jurong West Recycling Bin',
      address: '50 Jurong West Street 61',
      postalCode: '648200',
      buildingName: 'Jurong West MRT',
      location: {
        latitude: 1.3396,
        longitude: 103.7058,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-25',
      name: 'Gek Poh Shopping Centre Recycling Bin',
      address: '1 Jurong West Street 24',
      postalCode: '648186',
      buildingName: 'Gek Poh Shopping Centre',
      location: {
        latitude: 1.3458,
        longitude: 103.6958,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-26',
      name: 'NTU Recycling Bin',
      address: '50 Nanyang Avenue',
      postalCode: '639798',
      buildingName: 'Nanyang Technological University',
      location: {
        latitude: 1.3481,
        longitude: 103.6831,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-27',
      name: 'Tuas Recycling Bin',
      address: '1 Tuas South Street 1',
      postalCode: '637215',
      buildingName: 'Tuas South MRT',
      location: {
        latitude: 1.3203,
        longitude: 103.6489,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-28',
      name: 'Gul Circle Recycling Bin',
      address: '1 Gul Circle',
      postalCode: '629626',
      buildingName: 'Gul Circle MRT',
      location: {
        latitude: 1.3194,
        longitude: 103.6603,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-29',
      name: 'Tuas Link Recycling Bin',
      address: '1 Tuas West Drive',
      postalCode: '638455',
      buildingName: 'Tuas Link MRT',
      location: {
        latitude: 1.3403,
        longitude: 103.6369,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-30',
      name: 'Tuas Crescent Recycling Bin',
      address: '1 Tuas Crescent',
      postalCode: '637215',
      buildingName: 'Tuas Crescent MRT',
      location: {
        latitude: 1.3208,
        longitude: 103.6494,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    // North Singapore
    {
      id: 'bin-15',
      name: 'Woodlands Recycling Bin',
      address: '30 Woodlands Avenue 2',
      postalCode: '738343',
      buildingName: 'Causeway Point',
      location: {
        latitude: 1.4372,
        longitude: 103.7890,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-16',
      name: 'Sembawang Recycling Bin',
      address: '604 Sembawang Road',
      postalCode: '758459',
      buildingName: 'Sembawang Shopping Centre',
      location: {
        latitude: 1.4491,
        longitude: 103.8195,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-17',
      name: 'Yishun Recycling Bin',
      address: '930 Yishun Avenue 2',
      postalCode: '769098',
      buildingName: 'Northpoint City',
      location: {
        latitude: 1.4295,
        longitude: 103.8358,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    // South Singapore
    {
      id: 'bin-18',
      name: 'HarbourFront Recycling Bin',
      address: '1 HarbourFront Walk',
      postalCode: '098585',
      buildingName: 'VivoCity',
      location: {
        latitude: 1.2648,
        longitude: 103.8224,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-19',
      name: 'Sentosa Recycling Bin',
      address: '39 Artillery Avenue',
      postalCode: '099958',
      buildingName: 'Sentosa Island',
      location: {
        latitude: 1.2494,
        longitude: 103.8303,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-20',
      name: 'Kent Ridge Recycling Bin',
      address: '12 Kent Ridge Drive',
      postalCode: '119275',
      buildingName: 'NUS Kent Ridge Campus',
      location: {
        latitude: 1.2966,
        longitude: 103.7764,
      },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
  ];
};

// Helper function to calculate distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
