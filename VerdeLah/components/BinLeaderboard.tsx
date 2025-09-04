import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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

  const loadBinLeaderboard = useCallback(async () => {
    try {
      console.log('📊 Loading leaderboard for bin:', bin.id);
      setLoading(true);
      
      // Get bin statistics
      const binRef = doc(db, 'recyclingBins', bin.id);
      const binDoc = await getDoc(binRef);
      
      if (binDoc.exists()) {
        const binData = binDoc.data();
        console.log('📈 Bin stats loaded:', binData);
        setBinStats({
          totalRecycled: binData.totalRecycles || 0,
          totalUsers: binData.totalUsers || 0,
        });
      } else {
        console.log('⚠️ Bin document does not exist');
      }

      // Load user recycling records for this specific bin
      try {
        const userRecyclingRef = collection(db, 'userRecycling');
        const q = query(
          userRecyclingRef,
          where('binId', '==', bin.id),
          orderBy('recycledAt', 'desc')
        );
        
        console.log('🔍 Querying userRecycling collection for binId:', bin.id);
        const querySnapshot = await getDocs(q);
        console.log('📋 Found', querySnapshot.size, 'recycling records');
        
        const userRecyclingData: { [userId: string]: any[] } = {};
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;
          if (!userRecyclingData[userId]) {
            userRecyclingData[userId] = [];
          }
          userRecyclingData[userId].push(data);
        });

        // Get user details and create leaderboard entries
        const leaderboardEntries: LeaderboardEntry[] = [];
        
        for (const [userId, records] of Object.entries(userRecyclingData)) {
          try {
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const totalRecycled = records.length;
              const lastRecycledAt = records[0]?.recycledAt;
              const ecoPoints = userData.ecoPoints || 0;
              
              leaderboardEntries.push({
                userId,
                userName: userData.name || userData.displayName,
                totalRecycled,
                lastRecycledAt,
                ecoPoints,
              });
            }
          } catch (error) {
            console.error(`Error loading user ${userId}:`, error);
          }
        }

        // Sort by total recycled (descending)
        leaderboardEntries.sort((a, b) => b.totalRecycled - a.totalRecycled);
        
        console.log('🏆 Leaderboard entries created:', leaderboardEntries.length);
        setLeaderboard(leaderboardEntries);
        
        // Update bin stats with actual user count from leaderboard
        setBinStats(prev => ({
          ...prev,
          totalUsers: leaderboardEntries.length,
        }));
        
      } catch (queryError) {
        console.log('⚠️ userRecycling collection query failed, showing empty state:', queryError);
        // If the collection doesn't exist or query fails, show empty state
        setLeaderboard([]);
      }
      
    } catch (error) {
      console.error('Error loading bin leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [bin.id]);

  useEffect(() => {
    if (visible && bin.id) {
      console.log('🔄 BinLeaderboard useEffect triggered:', { visible, binId: bin.id });
      loadBinLeaderboard();
    }
  }, [bin.id, visible, loadBinLeaderboard]);

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

  if (!visible) {
    return null;
  }

  console.log('🎭 Rendering BinLeaderboard overlay:', { visible, leaderboardLength: leaderboard.length, binName: bin.name });

  return (
    <View style={styles.overlay}>
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
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : leaderboard.length > 0 ? (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.userId}
            style={styles.leaderboardList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Recycling Data Yet</Text>
            <Text style={styles.emptySubtext}>
              This bin hasn&apos;t been used for recycling yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Be the first to recycle here and earn points!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    backgroundColor: '#ffffff',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 20,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '500',
  },
});
