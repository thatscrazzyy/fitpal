// services/geminiService.ts
import { UserData, WorkoutPlan } from '../types/workout';

// This is our Gemini API integration
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Using local workout generation as fallback when API fails or in development
import { generateWorkoutPlan as generateLocalWorkout } from './localWorkoutService';

// Function to get API key from settings
import AsyncStorage from '@react-native-async-storage/async-storage';

const getGeminiSettings = async (): Promise<{ useGeminiAI: boolean, apiKey: string }> => {
  try {
    const settingsString = await AsyncStorage.getItem('app_settings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      return {
        useGeminiAI: settings.useGeminiAI ?? true,
        apiKey: settings.apiKey ?? ''
      };
    }
    return { useGeminiAI: true, apiKey: '' };
  } catch (error) {
    console.error('Error getting Gemini settings:', error);
    return { useGeminiAI: true, apiKey: '' };
  }
};

export const generateWorkoutWithGemini = async (userData: UserData): Promise<WorkoutPlan> => {
  try {
    // Get settings
    const { useGeminiAI, apiKey } = await getGeminiSettings();
    
    // Only call the API if Gemini is enabled and we have a valid API key
    if (useGeminiAI && apiKey && apiKey !== 'YOUR_API_KEY') {
      const prompt = createWorkoutPrompt(userData);
      
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      const data = await response.json();
      
      // Check if we have a valid response
      if (data.candidates && data.candidates[0].content.parts) {
        const workoutText = data.candidates[0].content.parts[0].text;
        return parseGeminiResponse(workoutText, userData);
      }
      
      // Log error and fall back to local generation
      console.log('Invalid Gemini API response:', data);
      return generateLocalWorkout(userData);
    }
    
    // Fall back to local workout generation if no API key or Gemini is disabled
    console.log('Using local workout generation (Gemini disabled or no API key)');
    return generateLocalWorkout(userData);
  } catch (error) {
    console.error('Error generating workout with Gemini:', error);
    // Fall back to local workout generation on error
    return generateLocalWorkout(userData);
  }
};

const createWorkoutPrompt = (userData: UserData): string => {
  return `Create a personalized workout plan with the following information:
  - Height: ${userData.height} inches
  - Weight: ${userData.weight} lbs
  - Goal Weight: ${userData.goalWeight} lbs
  - Intensity Level: ${userData.intensity}
  - Workout Duration: ${userData.duration} minutes per session
  ${userData.fitnessLevel ? `- Fitness Level: ${userData.fitnessLevel}` : ''}
  ${userData.primaryGoal ? `- Primary Goal: ${userData.primaryGoal}` : ''}
  ${userData.availableEquipment ? `- Available Equipment: ${userData.availableEquipment}` : ''}

  I need a detailed workout plan with the following structure (respond in JSON format):
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
            "equipment": "Equipment needed",
            "muscleGroup": "Primary muscle group targeted"
          }
        ],
        "restTime": "recommended rest between sets",
        "totalDuration": "estimated total duration"
      },
      "Tuesday": { ... },
      // Include other days as appropriate
    },
    "intensity": "beginner/intermediate/advanced",
    "recommendedWaterIntake": "daily water recommendation",
    "notes": [
      "Important note 1",
      "Important note 2"
    ]
  }

  Make it appropriate for someone with the stats and goals listed above. Include 3-5 exercises per day, with appropriate sets and reps. Rest days should be included as appropriate.`;
};

const parseGeminiResponse = (responseText: string, userData: UserData): WorkoutPlan => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      const workoutPlan = JSON.parse(jsonString) as WorkoutPlan;
      
      // Validate the parsed data
      if (workoutPlan.planName && workoutPlan.workoutDays) {
        return workoutPlan;
      }
    }
    
    // If we can't parse the response, fall back to local generation
    console.log('Unable to parse Gemini response:', responseText);
    return generateLocalWorkout(userData);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return generateLocalWorkout(userData);
  }
};