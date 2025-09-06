import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserProfileModal from '../../components/UserProfileModal';
import { db } from '../../services/firebase';

// Singapore neighborhoods for the challenge
const SINGAPORE_NEIGHBORHOODS = [
  'Ang Mo Kio',
  'Bedok',
  'Bishan',
  'Boon Lay',
  'Bukit Batok',
  'Bukit Merah',
  'Bukit Panjang',
  'Bukit Timah',
  'Central Area',
  'Choa Chu Kang',
  'Clementi',
  'Geylang',
  'Hougang',
  'Jurong East',
  'Jurong West',
  'Kallang',
  'Lim Chu Kang',
  'Mandai',
  'Marine Parade',
  'Novena',
  'Pasir Ris',
  'Punggol',
  'Queenstown',
  'Sembawang',
  'Sengkang',
  'Serangoon',
  'Tampines',
  'Tanglin',
  'Toa Payoh',
  'Woodlands',
  'Yishun'
];

export default function Profile() {
  const { user, userData, logout, updateUserData } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUsername, setEditingUsername] = useState(userData?.username || '');
  const [editingNeighborhood, setEditingNeighborhood] = useState(userData?.neighborhood || '');
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);


  const checkUsernameUniqueness = async (username: string, currentUserId: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      // Check if any user other than the current user has this username
      return querySnapshot.docs.every(doc => doc.id !== currentUserId);
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      return false;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!editingUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    if (editingUsername.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return;
    }

    if (editingUsername.length > 16) {
      Alert.alert('Error', 'Username must be 16 characters or less');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(editingUsername)) {
      Alert.alert('Error', 'Username can only contain letters, numbers, and underscores');
      return;
    }

    if (!editingNeighborhood) {
      Alert.alert('Error', 'Please select a neighborhood');
      return;
    }

    try {
      // Check if username is unique (only if it's different from current username)
      if (editingUsername !== userData?.username) {
        const isUsernameUnique = await checkUsernameUniqueness(editingUsername, user?.uid || '');
        if (!isUsernameUnique) {
          Alert.alert('Error', 'Username is already taken. Please choose a different username.');
          return;
        }
      }

      await updateUserData({
        username: editingUsername.trim(),
        neighborhood: editingNeighborhood,
      });
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const selectNeighborhood = (neighborhood: string) => {
    setEditingNeighborhood(neighborhood);
    setShowNeighborhoodDropdown(false);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Refresh user data - this will trigger a re-render with updated data
      // The AuthContext should handle refreshing user data
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      >
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userData?.username || 'Loading...'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.neighborhood}>📍 {userData?.neighborhood || 'No neighborhood set'}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userData?.ecoPoints || 0}</Text>
            <Text style={styles.statLabel}>Eco Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userData?.totalRecycled || 0}</Text>
            <Text style={styles.statLabel}>Items Recycled</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewProfileButton} 
          onPress={() => setShowUserProfile(true)}
        >
          <Text style={styles.viewProfileButtonText}>View My Badges</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {
            setEditingUsername(userData?.username || '');
            setEditingNeighborhood(userData?.neighborhood || '');
            setEditModalVisible(true);
          }}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={editingUsername}
                onChangeText={setEditingUsername}
                placeholder="Enter your username"
                maxLength={16}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>


            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Neighborhood</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowNeighborhoodDropdown(!showNeighborhoodDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !editingNeighborhood && styles.placeholderText
                ]}>
                  {editingNeighborhood || 'Select your neighborhood'}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showNeighborhoodDropdown ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {showNeighborhoodDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                    {SINGAPORE_NEIGHBORHOODS.map((hood) => (
                      <TouchableOpacity
                        key={hood}
                        style={[
                          styles.dropdownItem,
                          editingNeighborhood === hood && styles.selectedDropdownItem
                        ]}
                        onPress={() => selectNeighborhood(hood)}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          editingNeighborhood === hood && styles.selectedDropdownItemText
                        ]}>
                          {hood}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        user={userData ? {
          id: user?.uid || '',
          name: userData.username,
          ecoPoints: userData.ecoPoints || 0,
          totalRecycled: userData.totalRecycled || 0,
          neighborhood: userData.neighborhood,
        } : null}
      />
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  neighborhood: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  stats: {
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
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  viewProfileButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  viewProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    zIndex: 1001,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 1002,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    zIndex: 1002,
  },
  // Custom dropdown styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    minHeight: 50,
    zIndex: 1002,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 18,
    color: '#666',
    marginLeft: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    zIndex: 1003,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedDropdownItem: {
    backgroundColor: '#E8F5E8',
    borderBottomColor: '#2E7D32',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItemText: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
