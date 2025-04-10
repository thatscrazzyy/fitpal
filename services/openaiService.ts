// services/openaiService.ts
import { UserData, WorkoutPlan } from '../types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the local workout service as fallback
import { generateWorkoutPlan as generateLocalWorkout } from './localWorkoutService';

// Function to get API settings from AsyncStorage
const getApiSettings = async (): Promise<{ useOpenAI: boolean, apiKey: string }> => {
  try {
    const settingsString = await AsyncStorage.getItem('app_settings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      return {
        useOpenAI: settings.useOpenAI ?? true,
        apiKey: settings.apiKey ?? ''
      };
    }
    return { useOpenAI: true, apiKey: '' };
  } catch (error) {
    console.error('Error getting API settings:', error);
    return { useOpenAI: true, apiKey: '' };
  }
};

export const generateWorkoutWithOpenAI = async (userData: UserData): Promise<WorkoutPlan> => {
  try {
    // Get API settings
    const { useOpenAI, apiKey } = await getApiSettings();
    
    // Only call the API if OpenAI is enabled and we have a valid API key
    if (useOpenAI && apiKey && apiKey !== 'YOUR_API_KEY') {
      const prompt = createWorkoutPrompt(userData);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional fitness trainer specializing in creating personalized workout plans. You always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we have a valid response
      if (data.choices && data.choices[0].message.content) {
        let workoutPlan = parseOpenAIResponse(data.choices[0].message.content, userData);
        
        // Filter out exercises that don't match equipment constraints
        workoutPlan = filterIncompatibleExercises(workoutPlan, userData);
        
        return workoutPlan;
      }
      
      // Log error and fall back to local generation
      console.log('Invalid OpenAI API response:', data);
      return generateLocalWorkoutWithFiltering(userData);
    }
    
    // Fall back to local workout generation if no API key or OpenAI is disabled
    console.log('Using local workout generation (OpenAI disabled or no API key)');
    return generateLocalWorkoutWithFiltering(userData);
  } catch (error) {
    console.error('Error generating workout with OpenAI:', error);
    // Fall back to local workout generation on error
    return generateLocalWorkoutWithFiltering(userData);
  }
};

// Helper to generate local workout with filtering
const generateLocalWorkoutWithFiltering = async (userData: UserData): Promise<WorkoutPlan> => {
  const workoutPlan = generateLocalWorkout(userData);
  return filterIncompatibleExercises(workoutPlan, userData);
};

const createWorkoutPrompt = (userData: UserData): string => {
  // Determine the number of workout days based on intensity
  let workoutDays = 7; // Default to a full week
  
  const intensityLower = userData.intensity.toLowerCase();
  if (intensityLower.includes('beginner') || intensityLower.includes('low')) {
    workoutDays = 4; 
  } else if (intensityLower.includes('intermediate') || intensityLower.includes('medium')) {
    workoutDays = 5;
  } else if (intensityLower.includes('advanced') || intensityLower.includes('high')) {
    workoutDays = 6;
  }

  // Create a more specific equipment instruction based on user selection
  let equipmentInstruction = '';
  
  if (userData.availableEquipment) {
    if (userData.availableEquipment.includes('No Equipment')) {
      equipmentInstruction = `
VERY IMPORTANT: The user has NO EQUIPMENT available. Include ONLY bodyweight exercises. 
DO NOT include any exercises that require dumbbells, barbells, machines, or any equipment whatsoever. 
Every single exercise must be possible with just body weight.`;
    } else if (userData.availableEquipment.includes('Minimal Equipment')) {
      equipmentInstruction = `
IMPORTANT: The user has MINIMAL EQUIPMENT available. 
Primarily include bodyweight exercises and exercises that can be done with basic equipment like
resistance bands or a single pair of dumbbells. Avoid exercises requiring specialized gym equipment.`;
    } else if (userData.availableEquipment.includes('Home Gym')) {
      equipmentInstruction = `
The user has a HOME GYM setup. Include exercises that can be done with dumbbells, 
resistance bands, a bench, and basic equipment. Avoid exercises requiring specialized
machines typically only found in commercial gyms.`;
    } else {
      equipmentInstruction = `
The user has access to a FULL COMMERCIAL GYM. You can include any appropriate exercises,
including those requiring specialized equipment and machines.`;
    }
  }

  return `Create a personalized workout plan with the following information:
  - Height: ${userData.height} inches
  - Weight: ${userData.weight} lbs
  - Goal Weight: ${userData.goalWeight} lbs
  - Age: ${userData.age || 'Not specified'}
  - Gender: ${userData.gender || 'Not specified'}
  - Fitness Level: ${userData.fitnessLevel || 'Not specified'}
  - Primary Goal: ${userData.primaryGoal || 'Not specified'}
  - Intensity Level: ${userData.intensity}
  - Workout Duration: ${userData.duration} minutes per session
  
${equipmentInstruction}

  IMPORTANT: I need a FULL 7-DAY workout plan covering the entire week. Please include ALL days of the week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday. For rest days, simply specify them as rest days in the plan, but every day must be included.

  The workout plan should follow this structure (respond in JSON format):
  {
    "planName": "Name of the plan",
    "description": "Brief description of the plan",
    "workoutDays": {
      "Monday": {
        "exercises": [
          {
            "name": "Exercise name",
            "sets": number of sets,
            "reps": "rep range or duration",
            "description": "Brief description of the exercise",
            "equipment": "Equipment needed (or 'None' for bodyweight exercises)",
            "muscleGroup": "Primary muscle group targeted"
          }
        ],
        "restTime": "recommended rest between sets",
        "totalDuration": "estimated total duration"
      },
      "Tuesday": { ... },
      "Wednesday": { ... },
      "Thursday": { ... },
      "Friday": { ... },
      "Saturday": { ... },
      "Sunday": { ... }
    },
    "intensity": "beginner/intermediate/advanced",
    "recommendedWaterIntake": "daily water recommendation",
    "notes": [
      "Important note 1",
      "Important note 2"
    ]
  }

  For rest days, use this format:
  "RestDay": {
    "exercises": [],
    "restTime": "N/A",
    "totalDuration": "Rest Day"
  }

  Make it appropriate for someone with the stats and goals listed above. Include 3-5 exercises per workout day, with appropriate sets and reps. Distribute the workouts and rest days appropriately throughout the week based on the intensity level and best fitness practices.`;
};

const parseOpenAIResponse = (responseText: string, userData: UserData): WorkoutPlan => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      const workoutPlan = JSON.parse(jsonString) as WorkoutPlan;
      
      // Validate the parsed data
      if (workoutPlan.planName && workoutPlan.workoutDays) {
        // Make sure all days of the week are included
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        for (const day of allDays) {
          if (!workoutPlan.workoutDays[day]) {
            // If a day is missing, add it as a rest day
            workoutPlan.workoutDays[day] = {
              exercises: [],
              restTime: 'N/A',
              totalDuration: 'Rest Day'
            };
          }
        }
        
        return workoutPlan;
      }
    }
    
    // If we can't parse the response, try to parse the entire response as JSON
    try {
      const workoutPlan = JSON.parse(responseText) as WorkoutPlan;
      if (workoutPlan.planName && workoutPlan.workoutDays) {
        // Make sure all days of the week are included
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        for (const day of allDays) {
          if (!workoutPlan.workoutDays[day]) {
            // If a day is missing, add it as a rest day
            workoutPlan.workoutDays[day] = {
              exercises: [],
              restTime: 'N/A',
              totalDuration: 'Rest Day'
            };
          }
        }
        
        return workoutPlan;
      }
    } catch (innerError) {
      console.error('Failed to parse entire response as JSON:', innerError);
    }
    
    // If we still can't parse, fall back to local generation
    console.log('Unable to parse OpenAI response:', responseText);
    return generateLocalWorkout(userData);
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return generateLocalWorkout(userData);
  }
};

const filterIncompatibleExercises = (workoutPlan: WorkoutPlan, userData: UserData): WorkoutPlan => {
  // If no equipment constraint or full gym available, return the plan as is
  if (!userData.availableEquipment || 
      userData.availableEquipment.includes('Full Commercial Gym')) {
    return workoutPlan;
  }
  
  // Define which equipment is allowed based on user selection
  const noEquipmentAllowed = userData.availableEquipment.includes('No Equipment');
  const minimalEquipmentAllowed = userData.availableEquipment.includes('Minimal Equipment');
  const homeGymAllowed = userData.availableEquipment.includes('Home Gym');
  
  // Create a copy of the workout plan to modify
  const filteredPlan = { ...workoutPlan };
  
  // Bodyweight exercise keywords
  const bodyweightExercises = [
    'push-up', 'pushup', 'pull-up', 'pullup', 'squat', 'lunge', 'plank', 'crunch', 
    'sit-up', 'situp', 'burpee', 'jump', 'mountain climber', 'pike', 'bridge',
    'bodyweight', 'body weight', 'dip', 'superman', 'bird dog', 'bear crawl',
    'calf raise', 'jumping jack', 'high knee', 'walking', 'run', 'sprint', 'jog'
  ];
  
  // Minimal equipment exercises
  const minimalEquipment = [
    'band', 'resistance', 'dumbbell', 'medicine ball', 'kettlebell',
    'jump rope', 'bench'
  ];
  
  // Home gym equipment
  const homeGymEquipment = [
    ...minimalEquipment,
    'barbell', 'rack', 'bench press', 'pull-up bar', 'cable', 'machine'
  ];
  
  // Helper function to check if an exercise is compatible with equipment constraints
  const isExerciseCompatible = (exercise: string, equipment: string): boolean => {
    const exerciseLower = exercise.toLowerCase();
    const equipmentLower = equipment.toLowerCase();
    
    // For no equipment, only allow bodyweight exercises
    if (noEquipmentAllowed) {
      // Check if it's a known bodyweight exercise
      return bodyweightExercises.some(term => exerciseLower.includes(term)) ||
             equipmentLower === 'none' || 
             equipmentLower.includes('body weight') || 
             equipmentLower.includes('bodyweight');
    }
    
    // For minimal equipment
    if (minimalEquipmentAllowed) {
      return bodyweightExercises.some(term => exerciseLower.includes(term)) ||
             minimalEquipment.some(term => exerciseLower.includes(term)) ||
             equipmentLower === 'none' || 
             equipmentLower.includes('body weight') || 
             equipmentLower.includes('bodyweight') ||
             minimalEquipment.some(term => equipmentLower.includes(term));
    }
    
    // For home gym
    if (homeGymAllowed) {
      return bodyweightExercises.some(term => exerciseLower.includes(term)) ||
             homeGymEquipment.some(term => exerciseLower.includes(term)) ||
             equipmentLower === 'none' || 
             equipmentLower.includes('body weight') || 
             equipmentLower.includes('bodyweight') ||
             homeGymEquipment.some(term => equipmentLower.includes(term));
    }
    
    return true; // Default to allowing if no constraints matched
  };
  
  // Filter exercises in each workout day
  Object.keys(filteredPlan.workoutDays).forEach(day => {
    const workoutDay = filteredPlan.workoutDays[day];
    
    // Skip rest days
    if (!workoutDay.exercises || workoutDay.exercises.length === 0) {
      return;
    }
    
    // Filter exercises based on equipment compatibility
    const compatibleExercises = workoutDay.exercises.filter(exercise => 
      isExerciseCompatible(exercise.name, exercise.equipment || '')
    );
    
    // Replace exercises with compatible ones
    workoutDay.exercises = compatibleExercises;
    
    // If all exercises were filtered out, make it a rest day
    if (compatibleExercises.length === 0) {
      filteredPlan.workoutDays[day] = {
        exercises: [],
        restTime: 'N/A',
        totalDuration: 'Rest Day'
      };
    }
  });
  
  // Add a note about equipment constraints
  const equipmentNote = noEquipmentAllowed 
    ? "All exercises are bodyweight only, requiring no equipment." 
    : minimalEquipmentAllowed
    ? "Exercises require minimal equipment such as resistance bands or a single pair of dumbbells."
    : "Exercises are designed for a home gym setup.";
  
  filteredPlan.notes = [
    equipmentNote,
    ...(filteredPlan.notes || [])
  ];
  
  return filteredPlan;
};