import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../app/(tabs)/services/firebase';
import { RecyclingBin, calculateDistance } from './geojson-loader';

export interface FirestoreBin extends RecyclingBin {
  geohash: string;
  createdAt: any;
  recyclableMaterials?: string[];
  operatingHours?: string;
  accessibility?: string;
  maintenanceStatus?: string;
}

// Simplified loading - just get all bins and filter client-side for better performance
export const loadNearbyBinsFromFirestore = async (
  userLat: number,
  userLon: number,
  radiusKm: number = 5
): Promise<RecyclingBin[]> => {
  try {
    console.log(`🔍 Loading bins from Firestore (${radiusKm}km radius)`);
    
    // Simple query to get all bins
    const binsRef = collection(db, 'recyclingBins');
    const q = query(binsRef, orderBy('createdAt'), limit(100)); // Limit to 100 for performance
    
    const querySnapshot = await getDocs(q);
    const allBins: FirestoreBin[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreBin;
      return {
        id: doc.id,
        ...data
      } as FirestoreBin;
    });

    console.log(`📦 Loaded ${allBins.length} bins from Firestore`);

    // Calculate distances and filter by radius
    const binsWithDistance = allBins
      .map(bin => ({
        ...bin,
        distance: calculateDistance(userLat, userLon, bin.location.latitude, bin.location.longitude)
      }))
      .filter(bin => bin.distance <= radiusKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 20); // Return top 20 closest

    console.log(`✅ Returning ${binsWithDistance.length} bins within ${radiusKm}km`);
    
    // Log top 5 for debugging
    binsWithDistance.slice(0, 5).forEach((bin, index) => {
      console.log(`${index + 1}. ${bin.name} - ${bin.distance?.toFixed(2)}km`);
    });

    return binsWithDistance;

  } catch (error) {
    console.error('❌ Error loading bins from Firestore:', error);
    // Fallback to sample data
    console.log('🔄 Falling back to sample data...');
    return getSampleRecyclingBins();
  }
};

// Fallback sample data with enhanced names
const getSampleRecyclingBins = (): RecyclingBin[] => {
  return [
    {
      id: 'bin-1',
      name: 'Marina Bay Sands Recycling Bin',
      address: '10 Bayfront Avenue',
      postalCode: '018956',
      buildingName: 'Marina Bay Sands',
      location: { latitude: 1.2833, longitude: 103.8607 },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-2',
      name: 'Jurong Point Recycling Bin',
      address: '1 Jurong West Central 2',
      postalCode: '648886',
      buildingName: 'Jurong Point',
      location: { latitude: 1.3396, longitude: 103.7058 },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-3',
      name: 'JEM Shopping Centre Recycling Bin',
      address: '50 Jurong Gateway Road',
      postalCode: '608549',
      buildingName: 'JEM Shopping Centre',
      location: { latitude: 1.3333, longitude: 103.7431 },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-4',
      name: 'Pioneer Mall Recycling Bin',
      address: '31 Jurong West Street 63',
      postalCode: '648310',
      buildingName: 'Pioneer Mall',
      location: { latitude: 1.3375, longitude: 103.6965 },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
    {
      id: 'bin-5',
      name: 'Lakeside MRT Recycling Bin',
      address: '201 Jurong Gateway Road',
      postalCode: '608431',
      buildingName: 'Lakeside MRT',
      location: { latitude: 1.3447, longitude: 103.7203 },
      description: 'Mixed recycling bin for paper, plastics, glass, and metals',
      type: 'mixed',
      hyperlink: 'www.nea.gov.sg/3R',
    },
  ];
};
