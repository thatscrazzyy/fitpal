import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, DailyNutrition } from '../types/nutrition';

interface NutritionContextType {
  dailyNutrition: DailyNutrition | null;
  foodHistory: FoodItem[];
  calorieGoal: number;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => Promise<void>;
  removeFoodItem: (id: string) => Promise<void>;
  updateCalorieGoal: (goal: number) => Promise<void>;
  loadTodaysNutrition: () => Promise<void>;
}

const defaultNutrition: DailyNutrition = {
  date: new Date().toISOString().split('T')[0],
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
  goal: 2000, // Default calorie goal
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  }
};

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);

  // Load nutrition data when app starts
  useEffect(() => {
    loadTodaysNutrition();
    loadFoodHistory();
    loadCalorieGoal();
  }, []);

  const loadCalorieGoal = async () => {
    try {
      const goal = await AsyncStorage.getItem('calorie_goal');
      if (goal) {
        setCalorieGoal(parseInt(goal));
      }
    } catch (error) {
      console.error('Error loading calorie goal:', error);
    }
  };

  const loadFoodHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('food_history');
      if (history) {
        setFoodHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading food history:', error);
    }
  };

  const loadTodaysNutrition = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const nutrition = await AsyncStorage.getItem(`nutrition_${today}`);
      
      if (nutrition) {
        setDailyNutrition(JSON.parse(nutrition));
      } else {
        // Create a new record for today
        const newDailyNutrition = {
          ...defaultNutrition,
          date: today,
          goal: calorieGoal
        };
        setDailyNutrition(newDailyNutrition);
        await AsyncStorage.setItem(`nutrition_${today}`, JSON.stringify(newDailyNutrition));
      }
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    }
  };

  const updateCalorieGoal = async (goal: number) => {
    try {
      setCalorieGoal(goal);
      await AsyncStorage.setItem('calorie_goal', goal.toString());
      
      // Update today's nutrition record with new goal
      if (dailyNutrition) {
        const updated = { ...dailyNutrition, goal };
        setDailyNutrition(updated);
        await AsyncStorage.setItem(`nutrition_${updated.date}`, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error updating calorie goal:', error);
    }
  };

  const addFoodItem = async (item: Omit<FoodItem, 'id'>) => {
    try {
      if (!dailyNutrition) return;
      
      // Create a new food item with ID
      const newItem: FoodItem = {
        ...item,
        id: Date.now().toString()
      };
      
      // Add to meal type
      const updatedMeals = { ...dailyNutrition.meals };
      updatedMeals[item.mealType] = [...updatedMeals[item.mealType], newItem];
      
      // Update totals
      const updated: DailyNutrition = {
        ...dailyNutrition,
        totalCalories: dailyNutrition.totalCalories + newItem.calories,
        totalProtein: dailyNutrition.totalProtein + newItem.protein,
        totalCarbs: dailyNutrition.totalCarbs + newItem.carbs,
        totalFat: dailyNutrition.totalFat + newItem.fat,
        meals: updatedMeals
      };
      
      setDailyNutrition(updated);
      await AsyncStorage.setItem(`nutrition_${updated.date}`, JSON.stringify(updated));
      
      // Add to history for quick add later
      const updatedHistory = [newItem, ...foodHistory.slice(0, 19)]; // Keep last 20 items
      setFoodHistory(updatedHistory);
      await AsyncStorage.setItem('food_history', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };

  const removeFoodItem = async (id: string) => {
    try {
      if (!dailyNutrition) return;
      
      // Find the item to remove
      let itemToRemove: FoodItem | undefined;
      let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined;
      
      for (const meal of ['breakfast', 'lunch', 'dinner', 'snack'] as const) {
        const item = dailyNutrition.meals[meal].find(item => item.id === id);
        if (item) {
          itemToRemove = item;
          mealType = meal;
          break;
        }
      }
      
      if (!itemToRemove || !mealType) return;
      
      // Update meals array
      const updatedMeals = { ...dailyNutrition.meals };
      updatedMeals[mealType] = updatedMeals[mealType].filter(item => item.id !== id);
      
      // Update totals
      const updated: DailyNutrition = {
        ...dailyNutrition,
        totalCalories: dailyNutrition.totalCalories - itemToRemove.calories,
        totalProtein: dailyNutrition.totalProtein - itemToRemove.protein,
        totalCarbs: dailyNutrition.totalCarbs - itemToRemove.carbs,
        totalFat: dailyNutrition.totalFat - itemToRemove.fat,
        meals: updatedMeals
      };
      
      setDailyNutrition(updated);
      await AsyncStorage.setItem(`nutrition_${updated.date}`, JSON.stringify(updated));
      
    } catch (error) {
      console.error('Error removing food item:', error);
    }
  };

  return (
    <NutritionContext.Provider value={{
      dailyNutrition,
      foodHistory,
      calorieGoal,
      addFoodItem,
      removeFoodItem,
      updateCalorieGoal,
      loadTodaysNutrition
    }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};


