import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import { loadNearbyBinsFromFirestore } from '../services/firestore-bins';
import { RecyclingBin, calculateDistance, loadRecyclingBinsFromGeoJSON } from '../services/geojson-loader';
import BinInfoModal from './BinInfoModal';
import BinLeaderboard from './BinLeaderboard';

interface MapProps {
  onBinSelected?: (bin: RecyclingBin) => void;
  onClose?: () => void;
}

export default function RecyclingBinMap({ onBinSelected, onClose }: MapProps) {
  const [bins, setBins] = useState<RecyclingBin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBin, setSelectedBin] = useState<RecyclingBin | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [nearestBins, setNearestBins] = useState<RecyclingBin[]>([]);
  const mapRef = useRef<MapView>(null);

  const loadBins = useCallback(async (userLat?: number, userLon?: number) => {
    try {
      if (userLat && userLon) {
        // Load nearby bins from Firestore
        const binsData = await loadNearbyBinsFromFirestore(userLat, userLon, 10); // 10km radius
        setBins(binsData);
      
      } else {
        // Fallback to sample data if no location
        const binsData = await loadRecyclingBinsFromGeoJSON();
        setBins(binsData);
       
      }
    } catch (error) {
      console.error('Error loading bins:', error);
      Alert.alert('Error', 'Failed to load recycling bin data');
    } finally {
      setLoading(false);
    }
  }, []);

  const findNearestBins = useCallback((userLat: number, userLon: number) => {
    console.log(` Finding nearest bins from user location: ${userLat}, ${userLon}`);
    console.log(` Total bins available: ${bins.length}`);
    
    const binsWithDistance = bins.map(bin => ({
      ...bin,
      distance: calculateDistance(userLat, userLon, bin.location.latitude, bin.location.longitude)
    }));

    const nearest = binsWithDistance
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);

    console.log(`📍 Found ${nearest.length} nearest bins`);
    nearest.forEach((bin, index) => {
      console.log(`${index + 1}. ${bin.name} - ${bin.distance?.toFixed(2)}km`);
    });

    setNearestBins(nearest);
  }, [bins]);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation(location);
        // Don't call findNearestBins here - it will be called after bins are loaded
      } else {
        Alert.alert(
          'Location Permission',
          'Location permission is required to show your position and find nearby bins.'
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }, []);

  const initializeMap = useCallback(async () => {
    await requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Load bins when user location is available
  useEffect(() => {
    if (userLocation) {
      loadBins(userLocation.coords.latitude, userLocation.coords.longitude);
    }
  }, [userLocation, loadBins]);

  // Find nearest bins when both bins and user location are available
  useEffect(() => {
    if (bins.length > 0 && userLocation) {
      findNearestBins(userLocation.coords.latitude, userLocation.coords.longitude);
    }
  }, [bins, userLocation, findNearestBins]);

  const handleBinPress = (bin: RecyclingBin) => {
    setSelectedBin(bin);
    setShowModal(true);
    onBinSelected?.(bin);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedBin(null);
  };

  const handleShowLeaderboard = (bin: RecyclingBin) => {
    setSelectedBin(bin);
    setShowLeaderboard(true);
  };

  const handleLeaderboardClose = () => {
    setShowLeaderboard(false);
    setSelectedBin(null);
  };

  const handleRecycleRecorded = () => {
    // Refresh nearest bins if user location is available
    if (userLocation) {
      findNearestBins(userLocation.coords.latitude, userLocation.coords.longitude);
    }
  };


  const getBinColor = (bin: RecyclingBin) => {
    // Color based on distance if user location is available
    if (userLocation && nearestBins.length > 0) {
      const nearestBin = nearestBins.find(nb => nb.id === bin.id);
      if (nearestBin && nearestBin.distance !== undefined) {
        if (nearestBin.distance < 0.5) return '#4CAF50'; // Green for very close
        if (nearestBin.distance < 1.0) return '#FF9800'; // Orange for close
        return '#2196F3'; // Blue for far
      }
    }
    return '#2E7D32'; // Default green
  };

  const getInitialRegion = (): Region => {
    if (userLocation) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }
    // Default to Singapore center
    return {
      latitude: 1.3521,
      longitude: 103.8198,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading recycling bins...</Text>
        <Text style={styles.loadingSubtext}>This may take a moment</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={getInitialRegion()}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        {/* User Location Circle */}
        {userLocation && (
          <Circle
            center={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            radius={200}
            strokeColor="#2E7D32"
            fillColor="rgba(46, 125, 50, 0.1)"
            strokeWidth={2}
          />
        )}

        {/* Recycling Bin Markers */}
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={bin.location}
            title={bin.name}
            description={`${bin.address} • Tap for details`}
            onPress={() => handleBinPress(bin)}
          >
            <View style={[
              styles.markerContainer,
              { borderColor: getBinColor(bin) }
            ]}>
              <Text style={styles.markerIcon}>♻️</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Close Button - Top Left */}
      {onClose && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}


      {/* Nearest Bins List */}
      {nearestBins.length > 0 && (
        <View style={styles.nearestBinsContainer}>
          <Text style={styles.nearestBinsTitle}>📍 Nearest Bins</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearestBins.map((bin, index) => (
              <TouchableOpacity
                key={bin.id}
                style={styles.nearestBinCard}
                onPress={() => handleBinPress(bin)}
              >
                <Text style={styles.nearestBinName}>
                  {bin.buildingName || bin.address || `Bin ${index + 1}`}
                </Text>
                <Text style={styles.nearestBinDistance}>
                  {bin.distance !== undefined ? bin.distance.toFixed(2) : 'N/A'}km
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Bin Info Modal */}
      <BinInfoModal
        visible={showModal && !showLeaderboard}
        bin={selectedBin}
        onClose={handleModalClose}
        onRecycleRecorded={handleRecycleRecorded}
        onShowLeaderboard={handleShowLeaderboard}
      />

      {/* Bin Leaderboard Modal */}
      {showLeaderboard && selectedBin && (
        <BinLeaderboard
          bin={selectedBin}
          onClose={handleLeaderboardClose}
          visible={showLeaderboard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  nearestBinsContainer: {
    position: 'absolute',
    bottom: 30, // Reduced since nav bar is hidden
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 120, // Limit height to prevent overflow
  },
  nearestBinsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  nearestBinCard: {
    backgroundColor: '#f0f8f0',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  nearestBinName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  nearestBinDistance: {
    fontSize: 10,
    color: '#666',
  },
});
