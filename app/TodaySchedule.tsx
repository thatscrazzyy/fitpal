import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkout } from '../contexts/WorkoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, WorkoutDay, Exercise } from '../types/workout';

// Define the type for weekdays
interface Weekday {
  name: string;
  initial: string;
}

// Interface for saved workout
interface SavedWorkout extends WorkoutPlan {
  savedAt: string;
  id: string;
}

export default function RoutinePage(): JSX.Element {
  const router = useRouter();
  const { workoutPlan } = useWorkout();
  const [activeDay, setActiveDay] = useState<string>('');
  const [dayWorkout, setDayWorkout] = useState<WorkoutDay | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(workoutPlan);

  // List of weekdays with initials
  const daysOfWeek: Weekday[] = [
    { name: 'Monday', initial: 'M' },
    { name: 'Tuesday', initial: 'T' },
    { name: 'Wednesday', initial: 'W' },
    { name: 'Thursday', initial: 'T' },
    { name: 'Friday', initial: 'F' },
    { name: 'Saturday', initial: 'S' },
    { name: 'Sunday', initial: 'S' }
  ];

  // Load saved workouts
  useEffect(() => {
    const loadSavedWorkouts = async () => {
      try {
        const savedWorkoutsString = await AsyncStorage.getItem('saved_workouts');
        if (savedWorkoutsString) {
          const parsedWorkouts = JSON.parse(savedWorkoutsString) as SavedWorkout[];
          setSavedWorkouts(parsedWorkouts);
          
          // If there's no active workout from context, use the latest saved one
          if (!activeWorkout && parsedWorkouts.length > 0) {
            setActiveWorkout(parsedWorkouts[parsedWorkouts.length - 1]);
          }
        }
      } catch (error) {
        console.error('Error loading saved workouts:', error);
      }
    };
    
    loadSavedWorkouts();
  }, []);

  // Set current day when component mounts
  useEffect(() => {
    const today = new Date().getDay();
    // Convert to day name (0 = Sunday, 1 = Monday, etc.)
    const dayIndex = today === 0 ? 6 : today - 1; // Adjust to our array (0 = Monday)
    const currentDay = daysOfWeek[dayIndex].name;
    handleDaySelect(currentDay);
  }, [activeWorkout]);

  // Handle day selection
  const handleDaySelect = (day: string): void => {
    setActiveDay(day);
    
    if (activeWorkout && activeWorkout.workoutDays && activeWorkout.workoutDays[day]) {
      setDayWorkout(activeWorkout.workoutDays[day]);
    } else {
      setDayWorkout(null);
    }
  };

  // Create a new workout
  const handleCreateWorkout = () => {
    router.push('/WorkoutMaking');
  };

  // Switch between workouts
  const handleSwitchWorkout = async () => {
    if (savedWorkouts.length === 0) {
      Alert.alert(
        'No Saved Workouts',
        'You have no saved workouts. Create a new workout first.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Create options for each saved workout
    const options = savedWorkouts.map((workout, index) => ({
      text: `${workout.planName} (${new Date(workout.savedAt).toLocaleDateString()})`,
      onPress: () => {
        setActiveWorkout(workout);
        // Set the active day to the current day again to refresh the workout
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1;
        handleDaySelect(daysOfWeek[dayIndex].name);
      }
    }));
    
    // Add cancel option
    options.push({ text: 'Cancel', style: 'cancel' });
    
    Alert.alert('Select Workout', 'Choose a workout plan:', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* The Red Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Weekly Schedule</Text>
        <Pressable 
          style={styles.menuButton} 
          onPress={handleSwitchWorkout}
        >
          <Ionicons name="list-outline" size={24} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Workout Plan Title */}
        {activeWorkout ? (
          <View style={styles.workoutHeaderContainer}>
            <Text style={styles.workoutTitle}>{activeWorkout.planName}</Text>
            <Text style={styles.workoutDescription}>{activeWorkout.description}</Text>
          </View>
        ) : (
          <View style={styles.noWorkoutContainer}>
            <Text style={styles.noWorkoutText}>No active workout plan</Text>
            <Pressable 
              style={styles.createWorkoutButton}
              onPress={handleCreateWorkout}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFF" />
              <Text style={styles.createWorkoutButtonText}>Create Workout</Text>
            </Pressable>
          </View>
        )}

        {/* Day Selection List */}
        <Text style={styles.sectionTitle}>Select Day</Text>
        {daysOfWeek.map(({ name, initial }) => {
          const isSelected = activeDay === name;
          const hasWorkout = activeWorkout?.workoutDays && activeWorkout.workoutDays[name];

          return (
            <Pressable
              key={name}
              style={({ pressed }) => [
                styles.dayButton,
                isSelected && styles.selectedButton,
                pressed && styles.buttonPressed,
                hasWorkout ? {} : styles.dayButtonDisabled
              ]}
              onPress={() => hasWorkout && handleDaySelect(name)}
            >
              {/* Day Initial Circle */}
              <View style={[
                styles.initialCircle,
                isSelected && styles.selectedInitialCircle,
                !hasWorkout && styles.disabledInitialCircle
              ]}>
                <Text style={[
                  styles.initialText,
                  isSelected && styles.selectedInitialText,
                  !hasWorkout && styles.disabledInitialText
                ]}>
                  {initial}
                </Text>
              </View>

              {/* Day Name */}
              <Text style={[
                styles.dayButtonText,
                isSelected && styles.selectedButtonText,
                !hasWorkout && styles.disabledDayText
              ]}>
                {name}
              </Text>

              {/* Status Icon */}
              {hasWorkout ? (
                <Ionicons 
                  name={isSelected ? "chevron-down" : "chevron-forward"} 
                  size={20} 
                  color={isSelected ? '#E53935' : '#777'} 
                />
              ) : (
                <Text style={styles.restDayText}>Rest Day</Text>
              )}
            </Pressable>
          );
        })}

        {/* Exercise List for Selected Day */}
        {dayWorkout && (
          <View style={styles.exercisesContainer}>
            <View style={styles.dayInfoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={18} color="#E53935" />
                <Text style={styles.infoText}>Duration: {dayWorkout.totalDuration}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="timer-outline" size={18} color="#E53935" />
                <Text style={styles.infoText}>Rest: {dayWorkout.restTime}</Text>
              </View>
            </View>
            
            <Text style={styles.exercisesTitle}>Exercises</Text>
            {dayWorkout.exercises.map((exercise: Exercise, index: number) => (
              <View key={`${exercise.name}-${index}`} style={styles.exerciseItem}>
                <View style={styles.exerciseNumberContainer}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps}
                  </Text>
                  {exercise.equipment && exercise.equipment !== 'None' && (
                    <Text style={styles.equipmentText}>
                      Equipment: {exercise.equipment}
                    </Text>
                  )}
                </View>
              </View>
            ))}
            
            {/* Notes Section */}
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Tips & Notes</Text>
              {activeWorkout?.notes.map((note, index) => (
                <Text key={index} style={styles.noteText}>• {note}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
  },
  workoutHeaderContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noWorkoutContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 14,
  },
  createWorkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  createWorkoutButtonText: {
    color: '#FFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  dayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: '#F8F8F8',
  },
  selectedButton: {
    backgroundColor: '#FFEBEE',
    borderBottomWidth: 2,
    borderBottomColor: '#E53935',
  },
  dayButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  dayButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  selectedButtonText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  disabledDayText: {
    color: '#999',
  },
  initialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedInitialCircle: {
    backgroundColor: '#E53935', 
    borderColor: '#E53935',
  },
  disabledInitialCircle: {
    backgroundColor: '#EEEEEE',
    borderColor: '#DDDDDD',
  },
  initialText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  selectedInitialText: {
    color: '#FFFFFF',
  },
  disabledInitialText: {
    color: '#999',
  },
  restDayText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  exercisesContainer: {
    marginTop: 20,
  },
  dayInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumber: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  equipmentText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  notesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
});

