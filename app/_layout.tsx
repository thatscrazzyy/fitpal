import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WorkoutProvider } from '../contexts/WorkoutContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import { NutritionProvider } from '../contexts/NutritionContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <WorkoutProvider>
        <NutritionProvider>
          <GestureHandlerRootView style={styles.container}>
            <Stack screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
              <Stack.Screen name="index" options={{
                title: 'FitPal',
              }} />
              <Stack.Screen name="WorkoutMaking" options={{
                title: 'Create Workout',
              }} />
              <Stack.Screen name="WorkoutResults" options={{
                title: 'Workout Results',
              }} />
              <Stack.Screen name="TodaySchedule" options={{
                title: 'Schedule',
              }} />
              <Stack.Screen name="Settings" options={{
                title: 'Settings',
              }} />
              <Stack.Screen name="Nutrition" options={{
                title: 'Nutrition',
              }} />
              <Stack.Screen name="AddFood" options={{
                title: 'Add Food',
              }} />
            </Stack>
          </GestureHandlerRootView>
        </NutritionProvider>
      </WorkoutProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});