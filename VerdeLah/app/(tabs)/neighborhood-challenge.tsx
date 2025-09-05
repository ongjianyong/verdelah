import NeighborhoodChallenge from '@/components/NeighborhoodChallenge';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function NeighborhoodChallengeScreen() {
  const handleViewLeaderboard = () => {
    router.push('/(tabs)/leaderboard');
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
