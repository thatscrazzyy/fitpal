import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Define the props for our custom touchable component
interface CustomTouchableProps {
  style?: any;
  onPress: () => void;
  children: React.ReactNode;
}

// Exercise interface
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  description?: string;
}

export default function WorkoutResultsScreen(): JSX.Element {
  // Sample workout data - this would come from your generated workout
  const workoutTitle = "Upper Body Strength";
  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Push-Ups',
      sets: 3,
      reps: 12,
      restTime: 60,
      description: 'Keep your body straight and lower until your chest nearly touches the floor.'
    },
    {
      id: '2',
      name: 'Dumbbell Rows',
      sets: 3,
      reps: 10,
      restTime: 90,
      description: 'Maintain a flat back and pull the dumbbell to your hip.'
    },
    {
      id: '3',
      name: 'Shoulder Press',
      sets: 3,
      reps: 8,
      restTime: 90,
      description: 'Press the weights directly overhead, fully extending your arms.'
    },
    {
      id: '4',
      name: 'Tricep Dips',
      sets: 3,
      reps: 12,
      restTime: 60,
      description: 'Lower yourself until your elbows are at about a 90-degree angle.'
    }
  ];

  const handleSaveWorkout = () => {
    console.log('Saving workout...');
    // Implement save functionality
  };

  const handleStartWorkout = () => {
    console.log('Starting workout...');
    // Navigate to workout session screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Plan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Workout Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.workoutTitle}>{workoutTitle}</Text>
          <Text style={styles.subtitle}>Your personalized workout plan</Text>
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumberContainer}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
              </View>
              
              <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="repeat-outline" size={18} color="#E53935" />
                  <Text style={styles.detailText}>{exercise.sets} sets</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="fitness-outline" size={18} color="#E53935" />
                  <Text style={styles.detailText}>{exercise.reps} reps</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={18} color="#E53935" />
                  <Text style={styles.detailText}>{exercise.restTime}s rest</Text>
                </View>
              </View>
              
              {exercise.description && (
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomTouchable 
            style={styles.saveButton}
            onPress={handleSaveWorkout}
          >
            <Ionicons name="bookmark-outline" size={18} color="#E53935" />
            <Text style={styles.saveButtonText}>Save Workout</Text>
          </CustomTouchable>
          
          <CustomTouchable 
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Ionicons name="play" size={18} color="#FFF" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </CustomTouchable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Custom touchable component with a different name to avoid conflicts
const CustomTouchable: React.FC<CustomTouchableProps> = ({ style, onPress, children }) => (
  <Pressable
    style={({ pressed }) => [
      style,
      pressed && styles.buttonPressed
    ]}
    onPress={onPress}
  >
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  workoutTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  exercisesContainer: {
    marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumber: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#555',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 8,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});