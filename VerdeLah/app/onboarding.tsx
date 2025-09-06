import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to VerdeLah!',
    subtitle: 'Singapore\'s Green Revolution',
    description: 'Join thousands of Singaporeans making a difference for our environment through smart recycling and sustainable living.',
    icon: '🌱',
    color: '#2E7D32',
    backgroundColor: '#E8F5E8',
  },
  {
    id: 2,
    title: 'Scan & Learn',
    subtitle: 'AI-Powered Recycling',
    description: 'Use your camera to scan any item and get instant recycling information, eco-friendly alternatives, and environmental impact data.',
    icon: '📷',
    color: '#4CAF50',
    backgroundColor: '#E8F8E8',
  },
  {
    id: 3,
    title: 'Find Recycling Bins',
    subtitle: 'Locate Nearby Facilities',
    description: 'Discover recycling bins and facilities near you with our interactive map powered by NEA data.',
    icon: '📍',
    color: '#8BC34A',
    backgroundColor: '#F1F8E9',
  },
  {
    id: 4,
    title: 'Earn & Compete',
    subtitle: 'Gamified Sustainability',
    description: 'Earn Eco Points for your actions, compete with your neighborhood, and help Singapore become the greenest city.',
    icon: '🏆',
    color: '#FFC107',
    backgroundColor: '#FFFDE7',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleOnboardingComplete = () => {
    // For testing: always go to login, later we'll set this to only show once
    router.replace('/auth/login');
  };

  // Add pulsing animation for the swipe hint
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentSlide.color} />
      

      {/* Content with Swipe Navigation */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingData.map((slide, index) => (
          <View key={slide.id} style={styles.slideContainer}>
            <View style={styles.content}>
              <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
                <Text style={styles.icon}>{slide.icon}</Text>
              </Animated.View>
              
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <Text style={styles.description}>{slide.description}</Text>
              
              {index === 0 && (
                <Animated.Text style={[styles.swipeHint, { opacity: pulseAnim }]}>
                  Swipe right to continue →
                </Animated.Text>
              )}
              
              {index === onboardingData.length - 1 && (
                <TouchableOpacity 
                  style={[styles.getStartedButton, { backgroundColor: slide.color }]}
                  onPress={handleOnboardingComplete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getStartedButtonText}>Get Started</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentIndex ? currentSlide.color : '#E0E0E0',
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    width: width,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  swipeHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  getStartedButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  getStartedButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
