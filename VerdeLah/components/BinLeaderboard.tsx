import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../app/(tabs)/services/firebase';
import { RecyclingBin } from '../services/geojson-loader';

interface BinLeaderboardProps {
  bin: RecyclingBin;
  onClose: () => void;
  visible?: boolean;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalRecycled: number;
  lastRecycledAt: any;
  ecoPoints: number;
}

export default function BinLeaderboard({ bin, onClose, visible = true }: BinLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [binStats, setBinStats] = useState({
    totalRecycled: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    loadBinLeaderboard();
  }, [bin.id]);

  const loadBinLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get bin statistics
      const binRef = doc(db, 'recyclingBins', bin.id);
      const binDoc = await getDoc(binRef);
      
      if (binDoc.exists()) {
        const binData = binDoc.data();
        setBinStats({
          totalRecycled: binData.totalRecycles || 0,
          totalUsers: binData.totalUsers || 0,
        });
      }

      // For now, show a simple message since we don't have detailed recycler data
      // In the future, you could implement a more detailed leaderboard system
      setLeaderboard([]);
    } catch (error) {
      console.error('Error loading bin leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const getRankIcon = (rank: number) => {
      switch (rank) {
        case 0: return '🥇';
        case 1: return '🥈';
        case 2: return '🥉';
        default: return `${rank + 1}.`;
      }
    };

    return (
      <View style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{getRankIcon(index)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.userStats}>
            {item.totalRecycled} times • {item.ecoPoints} points
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            Last: {formatDate(item.lastRecycledAt)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 {bin.name} Leaderboard</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{binStats.totalRecycled}</Text>
          <Text style={styles.statLabel}>Total Recycled</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{binStats.totalUsers}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{leaderboard.length}</Text>
          <Text style={styles.statLabel}>Top Recyclers</Text>
        </View>
      </View>

      {leaderboard.length > 0 ? (
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.userId}
          style={styles.leaderboardList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bin Statistics</Text>
          <Text style={styles.emptySubtext}>
            Total recycling count: {binStats.totalRecycled}
          </Text>
          <Text style={styles.emptySubtext}>
            This bin has been used {binStats.totalRecycled} times for recycling
          </Text>
        </View>
      )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
