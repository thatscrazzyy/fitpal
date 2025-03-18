// components/ExerciseDemo.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Exercise } from '../types/workout';

// Mock data for exercise demonstrations
// In a real app, you would have actual images or videos for each exercise
const exerciseImages: { [key: string]: any } = {
  // Chest exercises
  'Push-ups': require('../assets/images/demo/pushups.png'),
  'Incline Push-ups': require('../assets/images/demo/incline-pushups.png'),
  'Dumbbell Chest Press': require('../assets/images/demo/dumbbell-chest-press.png'),
  'Bench Press': require('../assets/images/demo/bench-press.png'),
  'Chest Dips': require('../assets/images/demo/chest-dips.png'),
  
  // Back exercises
  'Dumbbell Rows': require('../assets/images/demo/dumbbell-rows.png'),
  'Superman Hold': require('../assets/images/demo/superman-hold.png'),
  'Pull-Ups': require('../assets/images/demo/pull-ups.png'),
  'Bent-Over Rows': require('../assets/images/demo/bent-over-rows.png'),
  
  // Legs exercises
  'Body Weight Squats': require('../assets/images/demo/squats.png'),
  'Lunges': require('../assets/images/demo/lunges.png'),
  'Glute Bridges': require('../assets/images/demo/glute-bridges.png'),
  'Romanian Deadlifts': require('../assets/images/demo/romanian-deadlifts.png'),
  
  // Core exercises
  'Planks': require('../assets/images/demo/planks.png'),
  'Crunches': require('../assets/images/demo/crunches.png'),
  'Russian Twists': require('../assets/images/demo/russian-twists.png'),
  
  // Default image for exercises without specific demonstrations
  'default': require('../assets/images/demo/default-exercise.png'),
};

// Helper function to get the image for an exercise
const getExerciseImage = (exerciseName: string) => {
  return exerciseImages[exerciseName] || exerciseImages['default'];
};

interface ExerciseDemoProps {
  exercise: Exercise;
  isVisible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const ExerciseDemo: React.FC<ExerciseDemoProps> = ({ exercise, isVisible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Mock steps for exercise demonstration
  const steps = [
    "Start in proper position with good form",
    "Execute the movement with controlled motion",
    "Maintain tension throughout the exercise",
    "Return to starting position without relaxing"
  ];
  
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={90} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={getExerciseImage(exercise.name)}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.details}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="barbell-outline" size={20} color="#E53935" />
                <Text style={styles.statText}>{exercise.sets} sets</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="repeat-outline" size={20} color="#E53935" />
                <Text style={styles.statText}>{exercise.reps}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="fitness-outline" size={20} color="#E53935" />
                <Text style={styles.statText}>{exercise.muscleGroup || 'General'}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{exercise.description}</Text>
            
            <Text style={styles.stepsTitle}>How to perform:</Text>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
            
            <View style={styles.equipmentContainer}>
              <Text style={styles.equipmentTitle}>Equipment needed:</Text>
              <Text style={styles.equipmentText}>{exercise.equipment}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
     );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      content: {
        width: width * 0.9,
        maxHeight: height * 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
      },
      closeButton: {
        padding: 5,
      },
      imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
      },
      image: {
        width: '100%',
        height: '100%',
      },
      details: {
        width: '100%',
      },
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      statItem: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
      },
      description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
        lineHeight: 22,
      },
      stepsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
      },
      stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
      },
      stepNumber: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      },
      stepNumberText: {
        color: 'white',
        fontWeight: 'bold',
      },
      stepText: {
        flex: 1,
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
      },
      equipmentContainer: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      equipmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      equipmentText: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
      },
      doneButton: {
        backgroundColor: '#E53935',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
      },
      doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    });
    
    export default ExerciseDemo;