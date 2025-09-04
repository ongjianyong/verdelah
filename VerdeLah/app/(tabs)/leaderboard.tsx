import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { NeighborhoodLeaderboardService, NeighborhoodStats } from '../../services/neighborhood-leaderboard';
import { db } from './services/firebase';

interface LeaderboardEntry {
  id: string;
  name: string;
  ecoPoints: number;
  totalRecycled: number;
  profilePicture?: string;
}

export default function Leaderboard() {
  const { userData } = useAuth();
  const params = useLocalSearchParams();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [neighborhoodLeaderboard, setNeighborhoodLeaderboard] = useState<NeighborhoodStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'points' | 'neighborhood-users' | 'neighborhood'>(
    params.tab === 'neighborhood' ? 'neighborhood' : 'points'
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      if (selectedTab === 'neighborhood') {
        const data = await NeighborhoodLeaderboardService.getNeighborhoodLeaderboard();
        setNeighborhoodLeaderboard(data);
      } else if (selectedTab === 'neighborhood-users') {
        // Fetch users from the current user's neighborhood
        if (userData?.neighborhood) {
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            where('neighborhood', '==', userData.neighborhood)
          );
          
          const querySnapshot = await getDocs(q);
          const data: LeaderboardEntry[] = [];
          
          querySnapshot.forEach((doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            } as LeaderboardEntry);
          });
          
          // Sort by ecoPoints in memory and limit to top 10
          const sortedData = data
            .sort((a, b) => b.ecoPoints - a.ecoPoints)
            .slice(0, 10);
          
          setLeaderboard(sortedData);
        } else {
          // If user has no neighborhood, show empty leaderboard
          setLeaderboard([]);
        }
      } else {
        // Global points leaderboard
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          orderBy('ecoPoints', 'desc'),
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
  }, [selectedTab, userData?.neighborhood]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchLeaderboard();
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchLeaderboard]);

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
        <View style={styles.profilePictureContainer}>
          {item.profilePicture ? (
            <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={styles.defaultProfilePicture}>
              <Text style={styles.defaultProfileText}>
                {item.name ? item.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserText]}>
            {item.name}
          </Text>
          <Text style={styles.userStats}>
            {selectedTab === 'points' 
              ? `${item.ecoPoints} Eco Points` 
              : `${item.ecoPoints} Eco Points`
            }
          </Text>
        </View>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>
          {selectedTab === 'neighborhood' 
            ? 'Top Neighborhoods' 
            : selectedTab === 'neighborhood-users'
            ? `Top Users in ${userData?.neighborhood || 'Your Neighborhood'}`
            : 'Top Singapore Eco Warriors'
          }
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'points' && styles.activeTab]}
          onPress={() => setSelectedTab('points')}
        >
          <Text style={[styles.tabText, selectedTab === 'points' && styles.activeTabText]}>
            Singapore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'neighborhood-users' && styles.activeTab]}
          onPress={() => setSelectedTab('neighborhood-users')}
        >
          <Text style={[styles.tabText, selectedTab === 'neighborhood-users' && styles.activeTabText]}>
            {userData?.neighborhood || 'My Neighborhood'}
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
        ) : selectedTab === 'neighborhood' ? (
          <FlatList
            data={neighborhoodLeaderboard}
            renderItem={renderNeighborhoodItem}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2E7D32']}
                tintColor="#2E7D32"
              />
            }
          />
        ) : selectedTab === 'neighborhood-users' && (!userData?.neighborhood || leaderboard.length === 0) ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {!userData?.neighborhood 
                ? 'Please set your neighborhood in your profile to see local rankings'
                : 'No users found in your neighborhood yet'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2E7D32']}
                tintColor="#2E7D32"
              />
            }
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
  profilePictureContainer: {
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2E7D32',
    alignSelf: 'center',
  },
  defaultProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
    alignSelf: 'center',
  },
  defaultProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
    marginLeft: 5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
