import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { NeighborhoodLeaderboardService, NeighborhoodStats } from '../services/neighborhood-leaderboard';

interface NeighborhoodChallengeProps {
  onViewLeaderboard?: () => void;
}

export default function NeighborhoodChallenge({ onViewLeaderboard }: NeighborhoodChallengeProps) {
  const { user, userData } = useAuth();
  const [neighborhoodStats, setNeighborhoodStats] = useState<NeighborhoodStats[]>([]);
  const [userNeighborhoodRank, setUserNeighborhoodRank] = useState<{
    rank: number;
    totalUsers: number;
    neighborhood: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWinner, setCurrentWinner] = useState<NeighborhoodStats | null>(null);

  useEffect(() => {
    fetchNeighborhoodData();
  }, []);

  const fetchNeighborhoodData = async () => {
    try {
      setLoading(true);
      const [leaderboard, winner] = await Promise.all([
        NeighborhoodLeaderboardService.getNeighborhoodLeaderboard(),
        NeighborhoodLeaderboardService.getCurrentMonthWinner(),
      ]);
      
      setNeighborhoodStats(leaderboard);
      setCurrentWinner(winner);

      // Get user's neighborhood rank if they have a neighborhood
      if (userData?.neighborhood && user?.uid) {
        const rank = await NeighborhoodLeaderboardService.getUserNeighborhoodRank(user.uid);
        setUserNeighborhoodRank(rank);
      }
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserNeighborhoodStats = () => {
    if (!userData?.neighborhood) return null;
    return neighborhoodStats.find(hood => hood.name === userData.neighborhood);
  };

  const getCurrentUserRank = () => {
    if (!userNeighborhoodRank) return null;
    return neighborhoodStats.findIndex(hood => hood.name === userNeighborhoodRank.neighborhood) + 1;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Neighborhood Challenge</Text>
          <Text style={styles.subtitle}>Loading challenge data...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Neighborhood Challenge</Text>
        <Text style={styles.subtitle}>Greenest Neighborhood of the Month</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Winner */}
        {currentWinner && (
          <View style={styles.winnerCard}>
            <Text style={styles.winnerTitle}>🥇 Current Champion</Text>
            <Text style={styles.winnerName}>{currentWinner.name}</Text>
            <View style={styles.winnerStats}>
              <View style={styles.winnerStat}>
                <Text style={styles.winnerStatNumber}>{currentWinner.averagePoints}</Text>
                <Text style={styles.winnerStatLabel}>Avg Points</Text>
              </View>
              <View style={styles.winnerStat}>
                <Text style={styles.winnerStatNumber}>{currentWinner.userCount}</Text>
                <Text style={styles.winnerStatLabel}>Members</Text>
              </View>
              <View style={styles.winnerStat}>
                <Text style={styles.winnerStatNumber}>{currentWinner.totalRecycled}</Text>
                <Text style={styles.winnerStatLabel}>Total Recycled</Text>
              </View>
            </View>
          </View>
        )}

        {/* User's Neighborhood Status */}
        {userData?.neighborhood && getUserNeighborhoodStats() && (
          <View style={styles.userNeighborhoodCard}>
            <Text style={styles.userNeighborhoodTitle}>📍 Your Neighborhood: {userData.neighborhood}</Text>
            <View style={styles.userNeighborhoodStats}>
              <View style={styles.userNeighborhoodStat}>
                <Text style={styles.userNeighborhoodStatNumber}>
                  #{getCurrentUserRank() || 'N/A'}
                </Text>
                <Text style={styles.userNeighborhoodStatLabel}>Rank</Text>
              </View>
              <View style={styles.userNeighborhoodStat}>
                <Text style={styles.userNeighborhoodStatNumber}>
                  {getUserNeighborhoodStats()?.averagePoints || 0}
                </Text>
                <Text style={styles.userNeighborhoodStatLabel}>Avg Points</Text>
              </View>
              <View style={styles.userNeighborhoodStat}>
                <Text style={styles.userNeighborhoodStatNumber}>
                  {getUserNeighborhoodStats()?.userCount || 0}
                </Text>
                <Text style={styles.userNeighborhoodStatLabel}>Members</Text>
              </View>
            </View>
            {userNeighborhoodRank && (
              <Text style={styles.userRankText}>
                You're #{userNeighborhoodRank.rank} in {userData.neighborhood} 
                ({userNeighborhoodRank.totalUsers} members)
              </Text>
            )}
          </View>
        )}

        {/* Top 5 Neighborhoods */}
        <View style={styles.topNeighborhoods}>
          <Text style={styles.sectionTitle}>🏅 Top 5 Neighborhoods</Text>
          {neighborhoodStats.slice(0, 5).map((hood, index) => (
            <View key={hood.name} style={[styles.neighborhoodItem, index === 0 && styles.firstPlace]}>
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>#{index + 1}</Text>
              </View>
              <View style={styles.neighborhoodInfo}>
                <Text style={styles.neighborhoodName}>{hood.name}</Text>
                <Text style={styles.neighborhoodDetails}>
                  {hood.averagePoints} avg points • {hood.userCount} members
                </Text>
              </View>
              <View style={styles.neighborhoodScore}>
                <Text style={styles.scoreText}>{hood.averagePoints}</Text>
                <Text style={styles.scoreLabel}>pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <TouchableOpacity style={styles.viewLeaderboardButton} onPress={onViewLeaderboard}>
          <Text style={styles.viewLeaderboardText}>View Full Leaderboard</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 0, // Remove bottom padding from main content
  },
  scrollContent: {
    paddingBottom: 90, // Adjusted to show full button with just a little space below
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Winner Card
  winnerCard: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15, // Reduced margin to make more room for button visibility
    borderWidth: 2,
    borderColor: '#FFD54F',
  },
  winnerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
    textAlign: 'center',
    marginBottom: 10,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 15,
  },
  winnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  winnerStat: {
    alignItems: 'center',
  },
  winnerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  winnerStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  // User Neighborhood Card
  userNeighborhoodCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15, // Reduced margin to make more room for button visibility
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userNeighborhoodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  userNeighborhoodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  userNeighborhoodStat: {
    alignItems: 'center',
  },
  userNeighborhoodStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  userNeighborhoodStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  userRankText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Top Neighborhoods
  topNeighborhoods: {
    marginBottom: 10, // Reduced margin to make more room for button visibility
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  neighborhoodItem: {
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
  firstPlace: {
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: '#FFD54F',
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
  neighborhoodInfo: {
    flex: 1,
    marginLeft: 15,
  },
  neighborhoodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  neighborhoodDetails: {
    fontSize: 12,
    color: '#666',
  },
  neighborhoodScore: {
    alignItems: 'center',
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
  // Button
  viewLeaderboardButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20, // Reduced margin for just a little space below button
    marginTop: 10, // Add some top margin for better spacing
  },
  viewLeaderboardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
