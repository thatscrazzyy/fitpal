// app/_layout.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WorkoutProvider } from '../contexts/WorkoutContext';
import { SettingsProvider } from '../contexts/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <WorkoutProvider>
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
          </Stack>
        </GestureHandlerRootView>
      </WorkoutProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});