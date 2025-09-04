import { useAuth } from '@/contexts/AuthContext';
import { useMap } from '@/contexts/MapContext';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BookmarksModal from '../../components/BookmarksModal';
import CameraScanner from '../../components/CameraScanner';
import RecyclingBinMap from '../../components/RecyclingBinMap';
import RecyclingInfoModal from '../../components/RecyclingInfoModal';
import { DetectedItem, detectItem } from '../../services/itemDetection';

export default function ExploreScreen() {
  const { userData } = useAuth();
  const { setMapOpen } = useMap();
  const { openMap } = useLocalSearchParams();
  const [scanning, setScanning] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [detectedItem, setDetectedItem] = useState<DetectedItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Update map context when showMap changes
  useEffect(() => {
    setMapOpen(showMap);
  }, [showMap, setMapOpen]);

  // Auto-open map if openMap parameter is set to 'true'
  // Use useFocusEffect to handle navigation back to this screen
  useFocusEffect(
    React.useCallback(() => {
      if (openMap === 'true') {
        setShowMap(true);
        // Clear the parameter from the URL after opening the map
        router.setParams({ openMap: undefined });
      }
    }, [openMap])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Refresh any data that might need updating
      // For now, just simulate a refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing explore page:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleScan = () => {
    setShowCamera(true);
  };

  const handleScanComplete = async (imageUri: string) => {
    setIsProcessing(true);
    try {
      const result = await detectItem(imageUri);
      if (result) {
        setDetectedItem(result);
        setShowResults(true);
      } else {
        Alert.alert(
          'Detection Failed',
          'We couldn\'t identify the item. Please try again with better lighting or a clearer image.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Detection error:', error);
      Alert.alert(
        'Error',
        'Something went wrong during detection. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setDetectedItem(null);
  };

  const handleScanAnother = () => {
    setShowCamera(true);
  };

  const handleViewBookmark = (item: DetectedItem) => {
    setDetectedItem(item);
    setShowResults(true);
    setShowBookmarks(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Scan & Recycle</Text>
            <Text style={styles.subtitle}>Discover how to recycle any item!</Text>
          </View>
          <TouchableOpacity 
            style={styles.bookmarksButton}
            onPress={() => setShowBookmarks(true)}
          >
            <Text style={styles.bookmarksIcon}>🔖</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      >
        <View style={styles.scanSection}>
          <TouchableOpacity
            style={[styles.scanButton, (isProcessing || scanning) && styles.scanButtonActive]}
            onPress={handleScan}
            disabled={isProcessing || scanning}
          >
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.scanButtonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.scanButtonText}>
                {scanning ? 'Scanning...' : '📷 Scan Item'}
              </Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.scanDescription}>
            Take a photo of any item to get instant recycling information and eco-friendly alternatives
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>♻️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Recycling Guide</Text>
              <Text style={styles.featureDescription}>
                Get official NEA recycling guidelines for any material
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌱</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Eco Alternatives</Text>
              <Text style={styles.featureDescription}>
                Discover sustainable alternatives with lower carbon footprint
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setShowMap(!showMap)}
          >
            <Text style={styles.featureIcon}>📍</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Bin Locator</Text>
              <Text style={styles.featureDescription}>
                Find nearby recycling bins and facilities
              </Text>
            </View>
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
      </ScrollView>

      {/* Map View */}
      {showMap && (
        <View style={styles.mapContainer}>
          <RecyclingBinMap onClose={() => setShowMap(false)} />
        </View>
      )}

      {/* Camera Scanner */}
      <CameraScanner
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Recycling Info Modal */}
      <RecyclingInfoModal
        visible={showResults}
        onClose={handleCloseResults}
        detectedItem={detectedItem}
        onScanAnother={handleScanAnother}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        visible={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        onViewItem={handleViewBookmark}
      />
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
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
  bookmarksButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
    marginLeft: 15,
  },
  bookmarksIcon: {
    fontSize: 20,
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
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
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