// contexts/WorkoutContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WorkoutPlan } from '../types/workout';

interface WorkoutContextType {
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan) => void;
  clearWorkoutPlan: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutPlan, setWorkoutPlanState] = useState<WorkoutPlan | null>(null);

  const setWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlanState(plan);
  };

  const clearWorkoutPlan = () => {
    setWorkoutPlanState(null);
  };

  return (
    <WorkoutContext.Provider value={{ workoutPlan, setWorkoutPlan, clearWorkoutPlan }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};