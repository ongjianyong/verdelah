import { useAuth } from '@/contexts/AuthContext';
import { useMap } from '@/contexts/MapContext';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BookmarksModal from '../../components/BookmarksModal';
import CameraScanner from '../../components/CameraScanner';
import RecyclingBinMap from '../../components/RecyclingBinMap';
import RecyclingInfoModal from '../../components/RecyclingInfoModal';
import { DetectedItem, detectItem } from '../../services/itemDetection';
import { ECO_TIPS } from './services/ecotips';



function getRandomTips(count = 3) {
  const shuffled = ECO_TIPS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function HomeScreen() {
  const { userData, loading: authLoading } = useAuth();
  const { setMapOpen } = useMap();
  const [tips, setTips] = useState(getRandomTips());
  const [refreshing, setRefreshing] = useState(false);
  
  // Scan and Map states
  const [showCamera, setShowCamera] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [detectedItem, setDetectedItem] = useState<DetectedItem | null>(null);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      setTips(getRandomTips());
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Only refresh tips - no unnecessary Firebase testing
      setTips(getRandomTips());
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);


 

  // Update map context when showMap changes
  useEffect(() => {
    setMapOpen(showMap);
  }, [showMap, setMapOpen]);

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

  const quickActions = [
    {
      title: 'Scan Item',
      description: 'Identify and recycle',
      icon: '📷',
      onPress: handleScan,
    },
    {
      title: 'Find Bins',
      description: 'Locate nearby bins',
      icon: '📍',
      onPress: () => setShowMap(true),
    },
    {
      title: 'Monthly Contest',
      description: 'See monthly rankings',
      icon: '🏆',
      onPress: () => router.push('/(tabs)/leaderboard'),
    },
  ];

  // Show loading state while user data is being fetched
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading your eco journey...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              Welcome back, {userData?.name || 'Eco Warrior'}! 🌱
            </Text>
            <Text style={styles.subtitle}>Ready to make a difference today?</Text>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']} // Android
            tintColor="#2E7D32" // iOS
          />
        }
      >
                 <View style={styles.statsContainer}>
           <View style={styles.statCard}>
             <Text style={styles.statNumber}>{userData?.ecoPoints || 0}</Text>
             <Text style={styles.statLabel}>Eco Points</Text>
           </View>
           <View style={styles.statCard}>
             <Text style={styles.statNumber}>{userData?.totalRecycled || 0}</Text>
             <Text style={styles.statLabel}>Items Recycled</Text>
           </View>
         </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>💡 Eco Tips</Text>
              {tips.map((tip, idx) => (
              <View style={styles.tipCard} key={idx}>
              <Text style={styles.tipText}>✅ {tip}</Text>
              </View> ))}
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

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.processingText}>Analyzing your item...</Text>
            <Text style={styles.processingSubtext}>This may take a few seconds</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
  greeting: {
    fontSize: 20,
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
    padding: 10,
    borderRadius: 20,
    marginLeft: 15,
  },
  bookmarksIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 75,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
     statLabel: {
     fontSize: 12,
     color: '#666',
     textAlign: 'center',
   },
  quickActions: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
  },
  tipsContainer: {
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  processingContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 200,
  },
  processingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
