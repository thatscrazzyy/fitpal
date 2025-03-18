// app/index.tsx

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Animated, Dimensions, StatusBar, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const router = useRouter();

  // Animations for fade-in and slide-up
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

  const navigateToWorkoutCreation = () => {
    router.push('/WorkoutMaking');
  };

  const navigateToSchedule = () => {
    router.push('/TodaySchedule');
  };
  
  const navigateToSettings = () => {
    router.push('/Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ImageBackground 
        source={require('../assets/images/backgroundhomepage.jpg')} 
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          {/* Settings Button */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={navigateToSettings}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={styles.content}>
            {/* App Name & Tagline */}
            <View style={styles.titleContainer}>
              <Text style={styles.appName}>Fit Pal</Text>
              <Text style={styles.tagline}>Your AI Fitness Coach</Text>
            </View>

            {/* Features */}
            <Animated.View 
              style={[
                styles.featuresWrapper,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={styles.featureBox}>
                <Ionicons name="body-outline" size={24} color={COLORS.primary} />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Personalized Workouts</Text>
                  <Text style={styles.featureDescription}>
                    Get AI-powered routines designed for your goals.
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureBox}>
                <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Smart Recommendations</Text>
                  <Text style={styles.featureDescription}>
                    Let AI adapt your workout based on your progress.
                  </Text>
                </View>
              </View>

              {/* Buttons */}
              <TouchableOpacity 
                style={styles.startButton}
                onPress={navigateToWorkoutCreation}
              >
                <Text style={styles.startButtonText}>Create Your Workout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={navigateToSchedule}
              >
                <Text style={styles.secondaryButtonText}>View Schedule</Text>
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
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    marginTop: height * 0.1,
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
    marginTop: height * 0.05,
  },
  featureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
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
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '500',
  },
});

export default WelcomeScreen;