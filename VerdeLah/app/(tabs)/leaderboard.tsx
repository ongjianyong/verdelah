import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from './services/firebase';
import { NeighborhoodLeaderboardService, NeighborhoodStats } from '../../services/neighborhood-leaderboard';
import { useLocalSearchParams } from 'expo-router';

interface LeaderboardEntry {
  id: string;
  name: string;
  ecoPoints: number;
  totalRecycled: number;
}

export default function Leaderboard() {
  const { userData } = useAuth();
  const params = useLocalSearchParams();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [neighborhoodLeaderboard, setNeighborhoodLeaderboard] = useState<NeighborhoodStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'points' | 'recycled' | 'neighborhood'>(
    params.tab === 'neighborhood' ? 'neighborhood' : 'points'
  );

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      if (selectedTab === 'neighborhood') {
        const data = await NeighborhoodLeaderboardService.getNeighborhoodLeaderboard();
        setNeighborhoodLeaderboard(data);
      } else {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          orderBy(selectedTab === 'points' ? 'ecoPoints' : 'totalRecycled', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const data: LeaderboardEntry[] = [];
        
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as LeaderboardEntry);
        });
        
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isCurrentUser = userData?.name === item.name;
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, isCurrentUser && styles.currentUserText]}>
            #{index + 1}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserText]}>
            {item.name}
          </Text>
          <Text style={styles.userStats}>
            {selectedTab === 'points' 
              ? `${item.ecoPoints} Eco Points` 
              : `${item.totalRecycled} Items Recycled`
            }
          </Text>
        </View>
        {isCurrentUser && <Text style={styles.youLabel}>YOU</Text>}
      </View>
    );
  };

  const renderNeighborhoodItem = ({ item, index }: { item: NeighborhoodStats; index: number }) => {
    const isCurrentUserNeighborhood = userData?.neighborhood === item.name;
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUserNeighborhood && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, isCurrentUserNeighborhood && styles.currentUserText]}>
            #{index + 1}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUserNeighborhood && styles.currentUserText]}>
            {item.name}
          </Text>
          <Text style={styles.userStats}>
            {item.averagePoints} avg points • {item.userCount} members
          </Text>
        </View>
        <View style={styles.neighborhoodScore}>
          <Text style={[styles.scoreText, isCurrentUserNeighborhood && styles.currentUserText]}>
            {item.averagePoints}
          </Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
        {isCurrentUserNeighborhood && <Text style={styles.youLabel}>YOURS</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>
          {selectedTab === 'neighborhood' ? 'Top Neighborhoods' : 'Top Eco Warriors'}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'points' && styles.activeTab]}
          onPress={() => setSelectedTab('points')}
        >
          <Text style={[styles.tabText, selectedTab === 'points' && styles.activeTabText]}>
            Eco Points
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recycled' && styles.activeTab]}
          onPress={() => setSelectedTab('recycled')}
        >
          <Text style={[styles.tabText, selectedTab === 'recycled' && styles.activeTabText]}>
            Items Recycled
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'neighborhood' && styles.activeTab]}
          onPress={() => setSelectedTab('neighborhood')}
        >
          <Text style={[styles.tabText, selectedTab === 'neighborhood' && styles.activeTabText]}>
            Neighborhoods
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : (
          <FlatList
            data={selectedTab === 'neighborhood' ? neighborhoodLeaderboard : leaderboard}
            renderItem={selectedTab === 'neighborhood' ? renderNeighborhoodItem : renderLeaderboardItem}
            keyExtractor={(item) => selectedTab === 'neighborhood' ? item.name : item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  leaderboardItem: {
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
  currentUserItem: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  currentUserText: {
    color: '#1B5E20',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    color: '#666',
  },
  youLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  neighborhoodScore: {
    alignItems: 'center',
    marginRight: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
