// types/workout.ts

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    description: string;
    equipment: string;
    muscleGroup?: string;
  }
  
  export interface WorkoutDay {
    exercises: Exercise[];
    restTime: string;
    totalDuration: string;
  }
  
  export interface WorkoutPlan {
    planName: string;
    description: string;
    workoutDays: { [key: string]: WorkoutDay };
    intensity: string;
    recommendedWaterIntake: string;
    notes: string[];
  }
  
  export interface UserData {
    height: number;
    weight: number;
    goalWeight: number;
    intensity: string;
    duration: number;
    fitnessLevel?: string;
    primaryGoal?: string;
    availableEquipment?: string;
  }