import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../(tabs)/services/firebase';


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

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectNeighborhood = (selectedNeighborhood: string) => {
    setNeighborhood(selectedNeighborhood);
    setShowNeighborhoodDropdown(false);
  };

  const closeDropdown = () => {
    setShowNeighborhoodDropdown(false);
  };

  const checkUsernameUniqueness = async (username: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword || !neighborhood) {
      Alert.alert('Error', 'Please fill in all fields including neighborhood');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert('Error', 'Username can only contain letters, numbers, and underscores');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Check if username is unique
      const isUsernameUnique = await checkUsernameUniqueness(username);
      if (!isUsernameUnique) {
        Alert.alert('Error', 'Username is already taken. Please choose a different username.');
        setLoading(false);
        return;
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: username });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        ecoPoints: 0,
        totalRecycled: 0,
        joinDate: new Date().toISOString(),
        level: 1,
        neighborhood: neighborhood,
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <View style={styles.gradient}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🌱</Text>
                <Text style={styles.title}>VerdeLah</Text>
              </View>
              <Text style={styles.subtitle}>Singapore&apos;s Eco Revolution</Text>
              <Text style={styles.welcomeText}>Join the green movement today!</Text>
            </View>


            {/* Form Card */}
            <TouchableWithoutFeedback onPress={closeDropdown}>
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Create Account</Text>
                  <Text style={styles.formSubtitle}>Be part of Singapore&apos;s eco community</Text>
                </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Choose a unique username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={[styles.inputContainer, { zIndex: 10 }]}>
                <Text style={styles.inputLabel}>Neighborhood</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowNeighborhoodDropdown(!showNeighborhoodDropdown)}
                >
                  <Text style={[
                    styles.dropdownButtonText,
                    !neighborhood && styles.placeholderText
                  ]}>
                    {neighborhood || 'Select your neighborhood'}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {showNeighborhoodDropdown ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
                
                {showNeighborhoodDropdown && (
                  <View style={styles.dropdownList}>
                    <ScrollView 
                      style={styles.dropdownScroll} 
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      scrollEnabled={true}
                    >
                      {SINGAPORE_NEIGHBORHOODS.map((hood) => (
                        <TouchableOpacity
                          key={hood}
                          style={[
                            styles.dropdownItem,
                            neighborhood === hood && styles.selectedDropdownItem
                          ]}
                          onPress={() => selectNeighborhood(hood)}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            neighborhood === hood && styles.selectedDropdownItemText
                          ]}>
                            {hood}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password (min 6 characters)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={styles.loginButtonText}>
                  Already have an account? <Text style={styles.loginLinkText}>Sign In</Text>
                </Text>
              </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: 'rgba(240, 248, 240, 0.95)', // Very light translucent green
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 48,
    marginRight: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2E7D32', // Dark green for contrast
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50', // Medium green
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#66BB6A', // Light green
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  formHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
    zIndex: 1,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    color: '#333',
    minHeight: 50,
  },
  // Custom dropdown styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 50,
    zIndex: 2,
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    maxHeight: 200,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dropdownScroll: {
    maxHeight: 200,
    backgroundColor: 'white',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  registerButton: {
    backgroundColor: 'rgba(46, 125, 50, 0.9)', // Darker green button (same as login)
    borderRadius: 12,
    marginBottom: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    color: '#666',
  },
  loginLinkText: {
    color: '#2E7D32',
    fontWeight: '700',
  },
});