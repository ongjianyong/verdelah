import { useAuth } from '@/contexts/AuthContext';
import { useMap } from '@/contexts/MapContext';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RecyclingBinMap from '../../components/RecyclingBinMap';

export default function ExploreScreen() {
  const { userData } = useAuth();
  const { setMapOpen } = useMap();
  const [scanning, setScanning] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Update map context when showMap changes
  useEffect(() => {
    setMapOpen(showMap);
  }, [showMap, setMapOpen]);

  const handleScan = () => {
    setScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      Alert.alert(
        'Scan Complete!',
        'This is a placeholder for the AI scanning feature. In the full version, this will identify items and provide recycling information.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan & Recycle</Text>
        <Text style={styles.subtitle}>Discover how to recycle any item!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.scanSection}>
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonActive]}
            onPress={handleScan}
            disabled={scanning}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : '📷 Scan Item'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.scanDescription}>
            Take a photo of any item to get instant recycling information and eco-friendly alternatives
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>♻️</Text>
            <Text style={styles.featureTitle}>Recycling Guide</Text>
            <Text style={styles.featureDescription}>
              Get official NEA recycling guidelines for any material
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌱</Text>
            <Text style={styles.featureTitle}>Eco Alternatives</Text>
            <Text style={styles.featureDescription}>
              Discover sustainable alternatives with lower carbon footprint
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setShowMap(!showMap)}
          >
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureTitle}>Bin Locator</Text>
            <Text style={styles.featureDescription}>
              Find nearby recycling bins and facilities
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Your Impact</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.ecoPoints || 0}</Text>
              <Text style={styles.statLabel}>Eco Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.totalRecycled || 0}</Text>
              <Text style={styles.statLabel}>Items Recycled</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Map View */}
      {showMap && (
        <View style={styles.mapContainer}>
          <RecyclingBinMap onClose={() => setShowMap(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scanSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  scanButtonActive: {
    backgroundColor: '#4CAF50',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  features: {
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  stats: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});