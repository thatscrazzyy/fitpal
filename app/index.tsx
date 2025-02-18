import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Animated, Dimensions,  StatusBar, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Welcome: undefined;
  CreateWorkout: undefined;
};

type WelcomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

// Theme colors
const COLORS = {
  primary: '#E53935',
  primaryDark: '#B71C1C',
  background: '#000',
  text: '#fff',
  textMuted: 'rgba(255, 255, 255, 0.8)',
};

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavProp>();

  // Animations for fade-in and slide-up (look at the animated library for React Native if you want to implement someting else)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ImageBackground 
        source={require('../files/images/backgroundhomepage.jpg')} // The Background image, its a a copyright free image rn but we can change it if required
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            {/* App Name & Tagline */}
            <View style={styles.titleContainer}>
              <Text style={styles.appName}>Fit Pal</Text>
              <Text style={styles.tagline}>Your AI Fitness Coach</Text>
            </View>

            {/* Features (We Can add more as we implement them)*/}
            <Animated.View 
              style={[
                styles.featuresWrapper,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              {/*Just add a container like this to make another feature on top oof it */}
              <View style={styles.featureBox}>
                <Ionicons name="body-outline" size={24} color={COLORS.primary} />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Personalized Workouts</Text>
                  <Text style={styles.featureDescription}>
                    Get AI-powered routines designed for your goals.
                  </Text>
                </View>
              </View>

              {/* Create Workout Button */}
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigation.navigate('CreateWorkout')}
              >
                <Text style={styles.startButtonText}>Create your Workout</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  featuresWrapper: {
    marginTop: height * 0.08,
  },
  featureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  featureText: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  startButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default WelcomeScreen; //This will help navigate back to this page
