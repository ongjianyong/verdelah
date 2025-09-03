import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DetectedItem, calculateEnvironmentalScore, getRecyclingTips } from '../services/itemDetection';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecyclingInfoModalProps {
  visible: boolean;
  onClose: () => void;
  detectedItem: DetectedItem | null;
  onScanAnother?: () => void;
}

const { width } = Dimensions.get('window');

export default function RecyclingInfoModal({ visible, onClose, detectedItem, onScanAnother }: RecyclingInfoModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<DetectedItem[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (detectedItem) {
      checkIfBookmarked();
    }
  }, [detectedItem, bookmarks]);

  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('recycling_bookmarks');
      if (storedBookmarks) {
        const parsedBookmarks = JSON.parse(storedBookmarks);
        setBookmarks(parsedBookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const checkIfBookmarked = () => {
    if (!detectedItem) return;
    const isBookmarkedItem = bookmarks.some(
      bookmark => bookmark.name === detectedItem.name && 
                  bookmark.material === detectedItem.material
    );
    setIsBookmarked(isBookmarkedItem);
  };

  const toggleBookmark = async () => {
    if (!detectedItem) return;

    try {
      let updatedBookmarks = [...bookmarks];
      
      if (isBookmarked) {
        // Remove from bookmarks
        updatedBookmarks = bookmarks.filter(
          bookmark => !(bookmark.name === detectedItem.name && 
                       bookmark.material === detectedItem.material)
        );
        setIsBookmarked(false);
        Alert.alert('Bookmark Removed', 'Item removed from your bookmarks');
      } else {
        // Add to bookmarks
        const bookmarkItem = {
          ...detectedItem,
          bookmarkedAt: new Date().toISOString()
        };
        updatedBookmarks.push(bookmarkItem);
        setIsBookmarked(true);
        Alert.alert('Bookmark Added', 'Item added to your bookmarks');
      }

      setBookmarks(updatedBookmarks);
      await AsyncStorage.setItem('recycling_bookmarks', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    }
  };

  const handleScanAnother = () => {
    onClose();
    if (onScanAnother) {
      onScanAnother();
    }
  };

  if (!detectedItem) return null;

  const environmentalScore = calculateEnvironmentalScore(detectedItem);
  const recyclingTips = getRecyclingTips(detectedItem.material);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FF5722';
    return '#F44336';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getRecyclabilityIcon = () => {
    if (detectedItem.recyclable) {
      return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
    }
    return <Ionicons name="close-circle" size={24} color="#F44336" />;
  };

  const getBiodegradabilityIcon = () => {
    switch (detectedItem.environmentalImpact.biodegradability) {
      case 'biodegradable':
        return <Ionicons name="leaf" size={20} color="#4CAF50" />;
      case 'slow_biodegradable':
        return <Ionicons name="time" size={20} color="#FF9800" />;
      case 'non_biodegradable':
        return <Ionicons name="warning" size={20} color="#F44336" />;
      default:
        return <Ionicons name="help-circle" size={20} color="#666" />;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Results</Text>
          <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? "#FF6B35" : "#333"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Information */}
          <View style={styles.section}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{detectedItem.name}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {Math.round(detectedItem.confidence * 100)}% match
                </Text>
              </View>
            </View>
            <Text style={styles.itemCategory}>{detectedItem.category}</Text>
            <Text style={styles.itemMaterial}>Material: {detectedItem.material}</Text>
          </View>

          {/* Environmental Score */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreNumber, { color: getScoreColor(environmentalScore) }]}>
                  {environmentalScore}
                </Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
              <View style={styles.scoreInfo}>
                <Text style={[styles.scoreGrade, { color: getScoreColor(environmentalScore) }]}>
                  {getScoreLabel(environmentalScore)}
                </Text>
                <Text style={styles.scoreDescription}>
                  Environmental friendliness score
                </Text>
              </View>
            </View>
          </View>

          {/* Recycling Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recycling Information</Text>
            <View style={styles.recyclabilityContainer}>
              <View style={styles.recyclabilityHeader}>
                {getRecyclabilityIcon()}
                <Text style={styles.recyclabilityText}>
                  {detectedItem.recyclable ? 'Recyclable' : 'Not Recyclable'}
                </Text>
              </View>
              <Text style={styles.instructions}>
                {detectedItem.recyclingInstructions}
              </Text>
            </View>
          </View>

          {/* Recycling Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recycling Tips</Text>
            {recyclingTips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="bulb" size={16} color="#FFC107" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Environmental Impact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.impactGrid}>
              <View style={styles.impactItem}>
                <Ionicons name="cloud" size={20} color="#2196F3" />
                <Text style={styles.impactLabel}>Carbon Footprint</Text>
                <Text style={styles.impactValue}>
                  {detectedItem.environmentalImpact.carbonFootprint} kg CO₂
                </Text>
              </View>
              <View style={styles.impactItem}>
                <Ionicons name="water" size={20} color="#00BCD4" />
                <Text style={styles.impactLabel}>Water Usage</Text>
                <Text style={styles.impactValue}>
                  {detectedItem.environmentalImpact.waterUsage}L
                </Text>
              </View>
              <View style={styles.impactItem}>
                {getBiodegradabilityIcon()}
                <Text style={styles.impactLabel}>Biodegradability</Text>
                <Text style={styles.impactValue}>
                  {detectedItem.environmentalImpact.biodegradability.replace('_', ' ')}
                </Text>
              </View>
              <View style={styles.impactItem}>
                <Ionicons name="refresh" size={20} color="#9C27B0" />
                <Text style={styles.impactLabel}>Recyclability</Text>
                <Text style={styles.impactValue}>
                  {detectedItem.environmentalImpact.recyclability.replace('_', ' ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Eco-Friendly Alternatives */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eco-Friendly Alternatives</Text>
            {detectedItem.ecoAlternatives.map((alternative, index) => (
              <View key={index} style={styles.alternativeCard}>
                <View style={styles.alternativeHeader}>
                  <Text style={styles.alternativeName}>{alternative.name}</Text>
                  <View style={styles.reductionBadge}>
                    <Text style={styles.reductionText}>
                      -{alternative.carbonFootprintReduction}% CO₂
                    </Text>
                  </View>
                </View>
                <Text style={styles.alternativeDescription}>
                  {alternative.description}
                </Text>
                <View style={styles.alternativeMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons 
                      name={alternative.costComparison === 'cheaper' ? 'trending-down' : 
                            alternative.costComparison === 'similar' ? 'remove' : 'trending-up'} 
                      size={16} 
                      color={alternative.costComparison === 'cheaper' ? '#4CAF50' : 
                             alternative.costComparison === 'similar' ? '#FF9800' : '#F44336'} 
                    />
                    <Text style={styles.metaText}>
                      {alternative.costComparison.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons 
                      name={alternative.availability === 'common' ? 'checkmark-circle' : 
                            alternative.availability === 'moderate' ? 'time' : 'alert-circle'} 
                      size={16} 
                      color={alternative.availability === 'common' ? '#4CAF50' : 
                             alternative.availability === 'moderate' ? '#FF9800' : '#F44336'} 
                    />
                    <Text style={styles.metaText}>
                      {alternative.availability}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.scanAnotherButton} 
            onPress={handleScanAnother}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.scanAnotherText}>Scan Another Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  bookmarkButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemMaterial: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreGrade: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
  },
  recyclabilityContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  recyclabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recyclabilityText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  impactItem: {
    width: (width - 80) / 2,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  impactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  alternativeCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  reductionBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reductionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  alternativeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  alternativeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  bottomActions: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scanAnotherButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  scanAnotherText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
