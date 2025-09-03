import React from 'react';
import { View, StyleSheet } from 'react-native';
import NeighborhoodChallenge from '@/components/NeighborhoodChallenge';
import { router } from 'expo-router';

export default function NeighborhoodChallengeScreen() {
  const handleViewLeaderboard = () => {
    router.push('/(tabs)/leaderboard?tab=neighborhood');
  };

  return (
    <View style={styles.container}>
      <NeighborhoodChallenge onViewLeaderboard={handleViewLeaderboard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
