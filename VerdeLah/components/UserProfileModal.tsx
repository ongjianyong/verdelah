import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BadgeService, UserStats } from '../services/badgeService';
import { Badge } from '../types/badges';

interface LeaderboardEntry {
  id: string;
  name: string;
  ecoPoints: number;
  totalRecycled: number;
  neighborhood?: string;
}

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: LeaderboardEntry | null;
}

const { width } = Dimensions.get('window');

export default function UserProfileModal({ visible, onClose, user }: UserProfileModalProps) {
  if (!user) return null;

  const userStats: UserStats = {
    ecoPoints: user.ecoPoints,
    totalRecycled: user.totalRecycled,
    neighborhood: user.neighborhood,
  };

  const badgesWithProgress = BadgeService.getAllBadgesWithProgress(userStats);
  const earnedBadges = badgesWithProgress.filter(badge => badge.earned);
  const unearnedBadges = badgesWithProgress.filter(badge => !badge.earned);

     const getRarityColor = (rarity: Badge['rarity']) => {
     switch (rarity) {
       case 'common': return '#4CAF50';
       case 'rare': return '#2196F3';
       case 'epic': return '#9C27B0';
       case 'legendary': return '#FFD700';
       default: return '#666';
     }
   };

  const renderBadge = (badge: Badge & { progress: number; earned: boolean }) => (
    <View
      key={badge.id}
      style={[
        styles.badgeCard,
        { borderColor: getRarityColor(badge.rarity) },
        !badge.earned && styles.unearnedBadge,
      ]}
    >
      <View style={styles.badgeHeader}>
        <Text style={styles.badgeIcon}>{badge.icon}</Text>
        <View style={styles.badgeInfo}>
          <Text style={[styles.badgeName, !badge.earned && styles.unearnedText]}>
            {badge.name}
          </Text>
          <Text style={[styles.badgeDescription, !badge.earned && styles.unearnedText]}>
            {badge.description}
          </Text>
        </View>
        <View style={styles.badgeRarity}>
          <Text style={[styles.rarityText, { color: getRarityColor(badge.rarity) }]}>
            {badge.rarity.toUpperCase()}
          </Text>
        </View>
      </View>
      {!badge.earned && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${badge.progress}%`, backgroundColor: getRarityColor(badge.rarity) },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(badge.progress)}%</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Profile</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                     {/* User Info Section */}
           <View style={styles.userInfoSection}>
             <Text style={styles.userName}>{user.name}</Text>
             {user.neighborhood && (
               <Text style={styles.userNeighborhood}>📍 {user.neighborhood}</Text>
             )}
           </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
                         <View style={styles.statsGrid}>
               <View style={styles.statCard}>
                 <Text style={styles.statNumber}>{user.ecoPoints}</Text>
                 <Text style={styles.statLabel}>Eco Points</Text>
               </View>
               <View style={styles.statCard}>
                 <Text style={styles.statNumber}>{user.totalRecycled}</Text>
                 <Text style={styles.statLabel}>Items Recycled</Text>
               </View>
               <View style={styles.statCard}>
                 <Text style={styles.statNumber}>{earnedBadges.length}</Text>
                 <Text style={styles.statLabel}>Badges Earned</Text>
               </View>
               <View style={styles.statCard}>
                 <Text style={styles.statNumber}>4</Text>
                 <Text style={styles.statLabel}>Total Badges</Text>
               </View>
             </View>
          </View>

          {/* Earned Badges Section */}
          {earnedBadges.length > 0 && (
            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>🏆 Earned Badges ({earnedBadges.length})</Text>
              {earnedBadges.map(renderBadge)}
            </View>
          )}

          {/* Unearned Badges Section */}
          {unearnedBadges.length > 0 && (
            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>🎯 Available Badges ({unearnedBadges.length})</Text>
              {unearnedBadges.map(renderBadge)}
            </View>
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
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#2E7D32',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 55, // Compensate for close button width
  },
  content: {
    flex: 1,
    padding: 20,
  },
     userInfoSection: {
     alignItems: 'center',
     marginBottom: 30,
     backgroundColor: 'white',
     padding: 20,
     borderRadius: 15,
     elevation: 2,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
   },
   userName: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#333',
     marginBottom: 5,
   },
  userNeighborhood: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
     statsGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
   },
   statCard: {
     backgroundColor: 'white',
     padding: 15,
     borderRadius: 10,
     alignItems: 'center',
     width: (width - 60) / 2,
     marginBottom: 10,
     elevation: 1,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.1,
     shadowRadius: 2,
   },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  badgesSection: {
    marginBottom: 30,
  },
  badgeCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unearnedBadge: {
    opacity: 0.6,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
  },
  unearnedText: {
    color: '#999',
  },
  badgeRarity: {
    alignItems: 'flex-end',
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    minWidth: 30,
    textAlign: 'right',
  },
});
