import { doc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../app/(tabs)/services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { RecyclingBin } from '../services/geojson-loader';

interface BinInfoModalProps {
  visible: boolean;
  bin: RecyclingBin | null;
  onClose: () => void;
  onRecycleRecorded: () => void;
  onShowLeaderboard?: (bin: RecyclingBin) => void;
}

export default function BinInfoModal({ visible, bin, onClose, onRecycleRecorded, onShowLeaderboard }: BinInfoModalProps) {
  const { user, userData, refreshUserData } = useAuth();
  const [recording, setRecording] = useState(false);

  const handleRecordRecycling = async () => {
    if (!user || !bin) return;

    Alert.alert(
      'Record Recycling',
      `Are you sure you want to record recycling at ${bin.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Record', onPress: confirmRecycling },
      ]
    );
  };

  const confirmRecycling = async () => {
    if (!user || !bin) return;

    setRecording(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const binRef = doc(db, 'recyclingBins', bin.id);

      // Update user's overall stats
      await updateDoc(userRef, {
        totalRecycles: increment(1),
        lastRecycleAt: serverTimestamp(),
      });

      // Update bin's specific stats - use setDoc with merge to handle missing documents
      await setDoc(binRef, {
        totalRecycles: increment(1),
        lastRecycleAt: serverTimestamp(),
      }, { merge: true });

      Alert.alert('Success', `Recycling recorded at ${bin.name}! You earned 10 points.`);
      onRecycleRecorded();
      refreshUserData();
    } catch (error) {
      console.error('Error recording recycling:', error);
      Alert.alert('Error', 'Failed to record recycling. Please try again.');
    } finally {
      setRecording(false);
      onClose();
    }
  };

  if (!bin) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.binName}>{bin.name}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Location</Text>
              <Text style={styles.address}>{bin.address}</Text>
              {bin.buildingName && (
                <Text style={styles.buildingName}>{bin.buildingName}</Text>
              )}
              {bin.postalCode && (
                <Text style={styles.postalCode}>Postal Code: {bin.postalCode}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>♻️ What You Can Recycle</Text>
              <Text style={styles.description}>{bin.description}</Text>
              {bin.recyclableMaterials && bin.recyclableMaterials.length > 0 && (
                <View style={styles.materialsContainer}>
                  {bin.recyclableMaterials.map((material, index) => (
                    <View key={index} style={styles.materialTag}>
                      <Text style={styles.materialText}>{material}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.recycleButton, recording && styles.recycleButtonDisabled]}
              onPress={handleRecordRecycling}
              disabled={recording}
            >
              {recording ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.recycleButtonText}>
                  ♻️ Record Recycling Here (+10 Points)
                </Text>
              )}
            </TouchableOpacity>

            {onShowLeaderboard && (
              <TouchableOpacity
                style={styles.leaderboardButton}
                onPress={() => onShowLeaderboard(bin)}
              >
                <Text style={styles.leaderboardButtonText}>🏆 View Bin Leaderboard</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  binName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  buildingName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  postalCode: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  recycleButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  recycleButtonDisabled: {
    backgroundColor: '#ccc',
  },
  recycleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaderboardButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  leaderboardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  materialTag: {
    backgroundColor: '#e0f2f7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  materialText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },
});

