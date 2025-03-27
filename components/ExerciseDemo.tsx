// components/ExerciseDemo.tsx

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Exercise } from '../types/workout';

interface ExerciseDemoProps {
  exercise: Exercise;
  isVisible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const ExerciseDemo: React.FC<ExerciseDemoProps> = ({ exercise, isVisible, onClose }) => {
  // Mock steps for exercise demonstration
  const steps = [
    "Start in proper position with good form",
    "Execute the movement with controlled motion",
    "Maintain tension throughout the exercise",
    "Return to starting position without relaxing"
  ];
  
  // Get appropriate icon based on exercise type/muscle group
  const getExerciseIcon = (exerciseName: string, muscleGroup?: string) => {
    // Default to body outline
    let iconName = "body-outline";
    
    // Check exercise name for common patterns
    const name = exerciseName.toLowerCase();
    
    if (name.includes('push') || name.includes('press') || name.includes('chest')) {
      iconName = "fitness-outline";
    } else if (name.includes('row') || name.includes('pull') || name.includes('back')) {
      iconName = "barbell-outline";
    } else if (name.includes('squat') || name.includes('lunge') || name.includes('leg')) {
      iconName = "walk-outline";
    } else if (name.includes('crunch') || name.includes('plank') || name.includes('ab')) {
      iconName = "radio-outline";
    } else if (name.includes('cardio') || name.includes('run') || name.includes('jump')) {
      iconName = "heart-outline";
    }
    
    // Check muscle group if available
    if (muscleGroup) {
      const group = muscleGroup.toLowerCase();
      if (group.includes('chest')) {
        iconName = "fitness-outline";
      } else if (group.includes('back')) {
        iconName = "barbell-outline";
      } else if (group.includes('leg')) {
        iconName = "walk-outline";
      } else if (group.includes('core') || group.includes('ab')) {
        iconName = "radio-outline";
      } else if (group.includes('cardio')) {
        iconName = "heart-outline";
      }
    }
    
    return iconName;
  };
  
  const exerciseIcon = getExerciseIcon(exercise.name, exercise.muscleGroup);
  
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
          
          <View style={styles.iconContainer}>
            <Ionicons name={exerciseIcon} size={80} color="#E53935" />
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
  iconContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#f5f5f5',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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