// app/WorkoutResults.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkout } from '../contexts/WorkoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseDemo from '../components/ExerciseDemo';
import { Exercise } from '../types/workout';

// Define the props for our custom touchable component
interface CustomTouchableProps {
  style?: any;
  onPress: () => void;
  children: React.ReactNode;
}

export default function WorkoutResultsScreen(): JSX.Element {
  const router = useRouter();
  const { workoutPlan } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  
  // Use useEffect for navigation instead of conditional rendering
  useEffect(() => {
    if (!workoutPlan) {
      Alert.alert(
        'No Workout Plan',
        'Please generate a workout plan first.',
        [{ text: 'OK', onPress: () => router.replace('/WorkoutMaking') }]
      );
    }
  }, [workoutPlan, router]);
  
  // Get array of days that have workouts (safely with better null checks)
  const workoutDays = workoutPlan && workoutPlan.workoutDays ? Object.keys(workoutPlan.workoutDays) : [];
  
  const handleSaveWorkout = async () => {
    if (!workoutPlan) return;
    
    try {
      // Get existing saved workouts
      const savedWorkoutsJson = await AsyncStorage.getItem('saved_workouts');
      const savedWorkouts = savedWorkoutsJson ? JSON.parse(savedWorkoutsJson) : [];
      
      // Add current workout with timestamp
      const workoutToSave = {
        ...workoutPlan,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };
      
      savedWorkouts.push(workoutToSave);
      
      // Save back to storage
      await AsyncStorage.setItem('saved_workouts', JSON.stringify(savedWorkouts));
      
      Alert.alert('Success', 'Workout plan saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout plan. Please try again.');
    }
  };

  const handleStartWorkout = () => {
    // In a real app, this would navigate to a workout session screen
    Alert.alert('Coming Soon', 'The workout tracking feature will be available in the next update!');
  };
  
  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDemoModal(true);
  };

  // Return loading placeholder if no workout
  if (!workoutPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Plan</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.workoutTitle}>{workoutPlan.planName}</Text>
          <Text style={styles.subtitle}>{workoutPlan.description}</Text>
        </View>
        
        {/* Intensity and Water Intake */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="flame-outline" size={22} color="#E53935" />
            <Text style={styles.infoLabel}>Intensity:</Text>
            <Text style={styles.infoValue}>{workoutPlan.intensity}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="water-outline" size={22} color="#E53935" />
            <Text style={styles.infoLabel}>Water:</Text>
            <Text style={styles.infoValue}>{workoutPlan.recommendedWaterIntake}</Text>
          </View>
        </View>

        {/* Workout Days */}
        {workoutDays && workoutDays.length > 0 ? (
          workoutDays.map((day) => (
            <View key={day} style={styles.dayContainer}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day}</Text>
                <Text style={styles.dayDuration}>
                  {workoutPlan?.workoutDays[day]?.totalDuration || 'Rest Day'}
                </Text>
              </View>
              
              {/* Exercises for this day - Add null check here too */}
              {workoutPlan?.workoutDays[day]?.exercises && 
               workoutPlan.workoutDays[day].exercises.length > 0 ? (
                workoutPlan.workoutDays[day].exercises.map((exercise, index) => (
                  <CustomTouchable
                    key={`${day}-${index}`}
                    style={styles.exerciseCard}
                    onPress={() => handleExercisePress(exercise)}
                  >
                    {/* Exercise content */}
                    <View style={styles.exerciseHeader}>
                      <View style={styles.exerciseNumberContainer}>
                        <Text style={styles.exerciseNumber}>{index + 1}</Text>
                      </View>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Ionicons name="information-circle-outline" size={22} color="#E53935" />
                    </View>
                    
                    <View style={styles.exerciseDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="repeat-outline" size={18} color="#E53935" />
                        <Text style={styles.detailText}>{exercise.sets} sets</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Ionicons name="fitness-outline" size={18} color="#E53935" />
                        <Text style={styles.detailText}>{exercise.reps}</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={18} color="#E53935" />
                        <Text style={styles.detailText}>{workoutPlan.workoutDays[day].restTime} rest</Text>
                      </View>
                    </View>
                  </CustomTouchable>
                ))
              ) : (
                <View style={styles.restDayContainer}>
                  <Ionicons name="bed-outline" size={36} color="#8F8F8F" />
                  <Text style={styles.restDayText}>Rest Day</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noWorkoutContainer}>
            <Text style={styles.noWorkoutText}>No workout days available.</Text>
          </View>
        )}
        
        {/* Notes Section */}
        {workoutPlan.notes && workoutPlan.notes.length > 0 && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Important Notes:</Text>
            {workoutPlan.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Ionicons name="checkmark-circle" size={18} color="#E53935" />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomTouchable 
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/WorkoutMaking',
              params: { 
                editMode: true,
                height: '70', 
                weight: '160',
                goalWeight: '150',
                intensity: workoutPlan.intensity,
                duration: '45'
              }
            })}
          >
            <Ionicons name="create-outline" size={18} color="#3f51b5" />
            <Text style={styles.editButtonText}>Edit</Text>
          </CustomTouchable>
          
          <CustomTouchable 
            style={styles.saveButton}
            onPress={handleSaveWorkout}
          >
            <Ionicons name="bookmark-outline" size={18} color="#E53935" />
            <Text style={styles.saveButtonText}>Save</Text>
          </CustomTouchable>
          
          <CustomTouchable 
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Ionicons name="play" size={18} color="#FFF" />
            <Text style={styles.startButtonText}>Start</Text>
          </CustomTouchable>
        </View>
      </ScrollView>
      
      {/* Exercise Demo Modal */}
      {selectedExercise && (
        <ExerciseDemo 
          exercise={selectedExercise}
          isVisible={showDemoModal}
          onClose={() => setShowDemoModal(false)}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginLeft: 6,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  dayDuration: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
    justifyContent: 'space-between',
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
    flex: 1,
    marginRight: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  restDayContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restDayText: {
    fontSize: 18,
    color: '#8F8F8F',
    marginTop: 8,
    fontWeight: '500',
  },
  noWorkoutContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  notesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#3f51b5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: '#3f51b5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
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
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 8,
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
    paddingHorizontal: 10,
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