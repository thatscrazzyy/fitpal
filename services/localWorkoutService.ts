// services/localWorkoutService.ts
import { Exercise, WorkoutPlan, WorkoutDay, UserData } from '../types/workout';

// This service provides a fallback method for generating workouts
// when the Gemini API is unavailable or fails

// Database of exercises organized by muscle groups and intensity
const exerciseDatabase = {
  beginner: {
    chest: [
      { name: 'Push-ups', sets: 3, reps: '8-10', description: 'Standard push-ups with proper form', equipment: 'None' },
      { name: 'Incline Push-ups', sets: 3, reps: '10-12', description: 'Push-ups with hands elevated on a bench or chair', equipment: 'Bench or Chair' },
      { name: 'Dumbbell Chest Press', sets: 3, reps: '10-12', description: 'Lying on back, press dumbbells upward', equipment: 'Dumbbells' },
    ],
    back: [
      { name: 'Dumbbell Rows', sets: 3, reps: '10-12', description: 'Bent over with one hand on bench, pull dumbbell to hip', equipment: 'Dumbbells' },
      { name: 'Superman Hold', sets: 3, reps: '15-20 sec', description: 'Lying face down, extend arms and legs off ground', equipment: 'None' },
      { name: 'Resistance Band Rows', sets: 3, reps: '12-15', description: 'Pull resistance band toward body while seated', equipment: 'Resistance Band' },
    ],
    legs: [
      { name: 'Body Weight Squats', sets: 3, reps: '12-15', description: 'Standard squats using just body weight', equipment: 'None' },
      { name: 'Lunges', sets: 2, reps: '10 each leg', description: 'Forward lunges alternating legs', equipment: 'None' },
      { name: 'Glute Bridges', sets: 3, reps: '12-15', description: 'Lying on back, lift hips toward ceiling', equipment: 'None' },
    ],
    core: [
      { name: 'Planks', sets: 3, reps: '20-30 sec', description: 'Hold plank position with proper form', equipment: 'None' },
      { name: 'Crunches', sets: 3, reps: '12-15', description: 'Basic abdominal crunches', equipment: 'None' },
      { name: 'Bird-Dog', sets: 3, reps: '10 each side', description: 'On hands and knees, extend opposite arm and leg', equipment: 'None' },
    ],
    cardio: [
      { name: 'Brisk Walking', sets: 1, reps: '20 min', description: 'Fast-paced walking', equipment: 'None' },
      { name: 'Stationary Bike', sets: 1, reps: '15 min', description: 'Low to moderate intensity cycling', equipment: 'Stationary Bike' },
      { name: 'Step-Ups', sets: 3, reps: '10 each leg', description: 'Step up onto a platform or stair', equipment: 'Bench or Step' },
    ],
  },
  intermediate: {
    chest: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: '8-10', description: 'Lying on bench, press dumbbells upward', equipment: 'Bench, Dumbbells' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', description: 'Press dumbbells on an incline bench', equipment: 'Incline Bench, Dumbbells' },
      { name: 'Push-up Variations', sets: 3, reps: '12-15', description: 'Diamond, wide-grip, or decline push-ups', equipment: 'None' },
    ],
    back: [
      { name: 'Bent-Over Rows', sets: 4, reps: '8-10', description: 'Bent over, pull barbell or dumbbells to abdomen', equipment: 'Barbell or Dumbbells' },
      { name: 'Lat Pulldowns', sets: 3, reps: '10-12', description: 'Pull down bar to chest on cable machine', equipment: 'Cable Machine' },
      { name: 'Seated Rows', sets: 3, reps: '10-12', description: 'Pull handles toward body on rowing machine', equipment: 'Cable Machine' },
    ],
    legs: [
      { name: 'Goblet Squats', sets: 4, reps: '10-12', description: 'Squat while holding dumbbell at chest', equipment: 'Dumbbell' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', description: 'Hinge at hips with slight knee bend, lowering weights', equipment: 'Barbell or Dumbbells' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each leg', description: 'Lunges moving forward with each rep', equipment: 'None or Dumbbells' },
    ],
    core: [
      { name: 'Russian Twists', sets: 3, reps: '15 each side', description: 'Seated, twist torso side to side', equipment: 'Dumbbell or Medicine Ball' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 each leg', description: 'In plank position, alternate bringing knees to chest', equipment: 'None' },
      { name: 'Bicycle Crunches', sets: 3, reps: '15 each side', description: 'Lying on back, alternate elbow to opposite knee', equipment: 'None' },
    ],
    cardio: [
      { name: 'Jogging', sets: 1, reps: '20-25 min', description: 'Moderate pace running', equipment: 'None' },
      { name: 'Jump Rope', sets: 3, reps: '2 min', description: 'Skipping with jump rope', equipment: 'Jump Rope' },
      { name: 'Burpees', sets: 3, reps: '10-12', description: 'Full body exercise combining squat, push-up, and jump', equipment: 'None' },
    ],
  },
  advanced: {
    chest: [
      { name: 'Bench Press', sets: 5, reps: '5-8', description: 'Barbell bench press with challenging weight', equipment: 'Bench, Barbell, Weights' },
      { name: 'Incline Bench Press', sets: 4, reps: '8-10', description: 'Barbell press on incline bench', equipment: 'Incline Bench, Barbell, Weights' },
      { name: 'Chest Dips', sets: 4, reps: '8-12', description: 'Dips focusing on chest engagement', equipment: 'Dip Bars' },
    ],
    back: [
      { name: 'Pull-Ups', sets: 4, reps: '8-12', description: 'Overhand grip pull-ups', equipment: 'Pull-Up Bar' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', description: 'Bent over barbell rows with heavy weight', equipment: 'Barbell, Weights' },
      { name: 'Deadlifts', sets: 5, reps: '5-8', description: 'Full deadlifts with proper form', equipment: 'Barbell, Weights' },
    ],
    legs: [
      { name: 'Barbell Squats', sets: 5, reps: '5-8', description: 'Full depth squats with barbell', equipment: 'Squat Rack, Barbell, Weights' },
      { name: 'Bulgarian Split Squats', sets: 4, reps: '8-10 each leg', description: 'Split squats with rear foot elevated', equipment: 'Bench, Dumbbells' },
      { name: 'Leg Press', sets: 4, reps: '8-10', description: 'Press weight away on leg press machine', equipment: 'Leg Press Machine' },
    ],
    core: [
      { name: 'Hanging Leg Raises', sets: 4, reps: '10-12', description: 'Hang from bar and raise legs to parallel', equipment: 'Pull-Up Bar' },
      { name: 'Cable Woodchoppers', sets: 3, reps: '12 each side', description: 'Diagonal cable pull across body', equipment: 'Cable Machine' },
      { name: 'Ab Wheel Rollouts', sets: 3, reps: '10-12', description: 'Kneel and roll ab wheel forward and back', equipment: 'Ab Wheel' },
    ],
    cardio: [
      { name: 'HIIT Sprints', sets: 8, reps: '30 sec sprint, 30 sec rest', description: 'All-out sprints followed by rest', equipment: 'None' },
      { name: 'Box Jumps', sets: 4, reps: '10-12', description: 'Jump onto raised platform', equipment: 'Plyo Box' },
      { name: 'Battle Ropes', sets: 4, reps: '30 sec', description: 'Wave patterns with heavy ropes', equipment: 'Battle Ropes' },
    ],
  }
};

// Helper function to determine intensity level
const getIntensityLevel = (intensityInput: string): 'beginner' | 'intermediate' | 'advanced' => {
  const input = intensityInput.toLowerCase();
  if (input.includes('low') || input.includes('beginner')) {
    return 'beginner';
  } else if (input.includes('high') || input.includes('advanced')) {
    return 'advanced';
  } else {
    return 'intermediate';
  }
};

// Helper function to determine workout focus based on goals
const determineWorkoutFocus = (currentWeight: number, goalWeight: number): string[] => {
  if (currentWeight > goalWeight) {
    // Weight loss focus
    return ['cardio', 'full-body', 'circuit'];
  } else if (currentWeight < goalWeight) {
    // Muscle gain focus
    return ['strength', 'hypertrophy', 'progressive'];
  } else {
    // Maintenance focus
    return ['balanced', 'toning', 'functional'];
  }
};

// Generate a workout day with exercises based on parameters
const generateWorkoutDay = (
  intensity: 'beginner' | 'intermediate' | 'advanced', 
  focusAreas: string[],
  duration: number
): WorkoutDay => {
  // Determine how many exercises based on duration
  // Roughly 5-7 minutes per exercise including rest
  const numberOfExercises = Math.max(3, Math.min(8, Math.floor(duration / 6)));
  
  // Select muscle groups to work
  // Simple rotation of major muscle groups
  const muscleGroups = ['chest', 'back', 'legs', 'core', 'cardio'];
  const selectedGroups = muscleGroups.slice(0, Math.min(4, numberOfExercises));
  
  // Add cardio if weight loss is a focus
  if (focusAreas.includes('cardio') && !selectedGroups.includes('cardio')) {
    selectedGroups.push('cardio');
  }
  
  const exercises: Exercise[] = [];
  
  // Select exercises for each group
  selectedGroups.forEach(group => {
    const groupExercises = exerciseDatabase[intensity][group];
    if (groupExercises) {
      // Randomly select one exercise from each group
      const randomIndex = Math.floor(Math.random() * groupExercises.length);
      exercises.push({
        ...groupExercises[randomIndex],
        muscleGroup: group
      });
    }
  });
  
  return {
    exercises,
    restTime: intensity === 'beginner' ? '60 sec' : intensity === 'intermediate' ? '45 sec' : '30 sec',
    totalDuration: `${duration} mins`
  };
};

export const generateWorkoutPlan = (userData: UserData): WorkoutPlan => {
  // Extract user data
  const { weight, goalWeight, intensity, duration } = userData;
  
  // Determine intensity level
  const intensityLevel = getIntensityLevel(intensity);
  
  // Determine workout focus based on weight goals
  const focusAreas = determineWorkoutFocus(weight, goalWeight);
  
  // Generate workout days (3 days for beginners, 4 for intermediate, 5 for advanced)
  const numberOfDays = 
    intensityLevel === 'beginner' ? 3 :
    intensityLevel === 'intermediate' ? 4 : 5;
  
  const workoutDays: { [key: string]: WorkoutDay } = {};
  
  // Create workout for each day
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (let i = 0; i < numberOfDays; i++) {
    workoutDays[weekdays[i]] = generateWorkoutDay(intensityLevel, focusAreas, duration);
  }
  
  return {
    planName: `${intensityLevel.charAt(0).toUpperCase() + intensityLevel.slice(1)} ${focusAreas[0].charAt(0).toUpperCase() + focusAreas[0].slice(1)} Plan`,
    description: `A ${intensityLevel} workout plan focused on ${focusAreas.join(', ')} training.`,
    workoutDays,
    intensity: intensityLevel,
    recommendedWaterIntake: `${Math.round(weight * 0.5)} oz per day`,
    notes: [
      "Remember to warm up before each workout session",
      "Stay hydrated throughout your workout",
      "Adjust weights as needed to maintain proper form",
      "Rest at least one day between training the same muscle group"
    ]
  };
};