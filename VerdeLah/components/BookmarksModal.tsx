import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetectedItem, calculateEnvironmentalScore } from '../services/itemDetection';

interface BookmarkedItem extends DetectedItem {
  bookmarkedAt: string;
}

interface BookmarksModalProps {
  visible: boolean;
  onClose: () => void;
  onViewItem: (item: DetectedItem) => void;
}

export default function BookmarksModal({ visible, onClose, onViewItem }: BookmarksModalProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadBookmarks();
    }
  }, [visible]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const storedBookmarks = await AsyncStorage.getItem('recycling_bookmarks');
      if (storedBookmarks) {
        const parsedBookmarks: BookmarkedItem[] = JSON.parse(storedBookmarks);
        setBookmarks(parsedBookmarks);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      Alert.alert('Error', 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (itemToRemove: BookmarkedItem) => {
    try {
      const updatedBookmarks = bookmarks.filter(
        bookmark => !(bookmark.name === itemToRemove.name && 
                     bookmark.material === itemToRemove.material)
      );
      setBookmarks(updatedBookmarks);
      await AsyncStorage.setItem('recycling_bookmarks', JSON.stringify(updatedBookmarks));
      Alert.alert('Bookmark Removed', 'Item removed from your bookmarks');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  const clearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all bookmarks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setBookmarks([]);
              await AsyncStorage.removeItem('recycling_bookmarks');
              Alert.alert('Success', 'All bookmarks have been cleared');
            } catch (error) {
              console.error('Error clearing bookmarks:', error);
              Alert.alert('Error', 'Failed to clear bookmarks');
            }
          }
        }
      ]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FF5722';
    return '#F44336';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookmarks</Text>
          {bookmarks.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllBookmarks}>
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading bookmarks...</Text>
            </View>
          ) : bookmarks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
              <Text style={styles.emptyDescription}>
                Bookmark items while scanning to save them for later reference
              </Text>
            </View>
          ) : (
            bookmarks.map((item: BookmarkedItem, index) => {
              const environmentalScore = calculateEnvironmentalScore(item);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.bookmarkCard}
                  onPress={() => onViewItem(item)}
                >
                  <View style={styles.bookmarkHeader}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemMaterial}>{item.material}</Text>
                    </View>
                    <View style={styles.scoreContainer}>
                      <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(environmentalScore) + '20' }]}>
                        <Text style={[styles.scoreNumber, { color: getScoreColor(environmentalScore) }]}>
                          {environmentalScore}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.bookmarkFooter}>
                    <View style={styles.recyclabilityInfo}>
                      <Ionicons 
                        name={item.recyclable ? "checkmark-circle" : "close-circle"} 
                        size={16} 
                        color={item.recyclable ? "#4CAF50" : "#F44336"} 
                      />
                      <Text style={styles.recyclabilityText}>
                        {item.recyclable ? 'Recyclable' : 'Not Recyclable'}
                      </Text>
                    </View>
                    <View style={styles.bookmarkActions}>
                      <Text style={styles.bookmarkDate}>
                        {item.bookmarkedAt ? formatDate(item.bookmarkedAt) : 'Recently'}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeBookmark(item)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
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
  clearButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  bookmarkCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemMaterial: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    marginLeft: 12,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookmarkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recyclabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recyclabilityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  bookmarkActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
});

