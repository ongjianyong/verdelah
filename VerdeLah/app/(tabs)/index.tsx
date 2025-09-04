import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ECO_TIPS } from './services/ecotips';
import { testFirebaseConnections } from './services/firebase-test';



function getRandomTips(count = 3) {
  const shuffled = ECO_TIPS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function HomeScreen() {
  const { userData } = useAuth();
  const [tips, setTips] = useState(getRandomTips());


  useFocusEffect(
    React.useCallback(() => {
      setTips(getRandomTips());
    }, [])
  );


 
  useEffect(() => {
    testFirebaseConnections().then((result) => {
      if (result.success) {
        console.log(' Firebase test passed:', result.message);
      } else {
        console.error('Firebase test failed:', result.error);
        Alert.alert(
          'Firebase Connection Error',
          'Failed to connect to Firebase services. Please check your configuration.',
          [{ text: 'OK' }]
        );
      }
    });
  }, []);

  const quickActions = [
    {
      title: 'Scan Item',
      description: 'Identify and recycle',
      icon: '📷',
      onPress: () => router.push('/(tabs)/explore'),
    },
    {
      title: 'Find Bins',
      description: 'Locate nearby bins',
      icon: '📍',
      onPress: () => router.push('/(tabs)/explore?openMap=true'),
    },
    {
      title: 'Leaderboard',
      description: 'See top recyclers',
      icon: '🏆',
      onPress: () => router.push('/(tabs)/leaderboard'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {userData?.name || 'Eco Warrior'}! 🌱
        </Text>
        <Text style={styles.subtitle}>Ready to make a difference today?</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
                 <View style={styles.statsContainer}>
           <View style={styles.statCard}>
             <Text style={styles.statNumber}>{userData?.ecoPoints || 0}</Text>
             <Text style={styles.statLabel}>Eco Points</Text>
           </View>
           <View style={styles.statCard}>
             <Text style={styles.statNumber}>{userData?.totalRecycled || 0}</Text>
             <Text style={styles.statLabel}>Items Recycled</Text>
           </View>
         </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Neighborhood Challenge Section */}
        {userData?.neighborhood && (
          <View style={styles.challengeSection}>
            <Text style={styles.sectionTitle}>🏆 Neighborhood Challenge</Text>
            <View style={styles.challengePreview}>
              <Text style={styles.challengeText}>
                Compete with {userData.neighborhood} for the title of &ldquo;Greenest Neighborhood of the Month&rdquo;!
              </Text>
              <TouchableOpacity
                style={styles.challengeButton}
                onPress={() => router.push('/(tabs)/neighborhood-challenge')}
              >
                <Text style={styles.challengeButtonText}>Join Challenge</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>💡 Eco Tips</Text>
              {tips.map((tip, idx) => (
              <View style={styles.tipCard} key={idx}>
              <Text style={styles.tipText}>✅ {tip}</Text>
              </View> ))}
        </View>
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
  greeting: {
    fontSize: 20,
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
  },
  scrollContent: {
    paddingBottom: 70,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
     statLabel: {
     fontSize: 12,
     color: '#666',
     textAlign: 'center',
   },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionCard: {
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
  actionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  challengeSection: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 15,
    borderRadius: 10,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengePreview: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  challengeText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  challengeButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
