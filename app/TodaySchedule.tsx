import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// this defines the type for weekdays
interface Weekday {
  name: string;
  initial: string;
}

export default function RoutinePage(): JSX.Element {
  const [activeDay, setActiveDay] = useState<string | null>(null);

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

  //This just logs the clicks and on different OS like web/ios so that we can connect it later 
  const handleDaySelect = (day: string): void => {
    setActiveDay(day);
    console.log(`Selected: ${day} on ${Platform.OS}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* The Red Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fit Pal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Workout Routine</Text>

        {/* Day Selection List */}
        {daysOfWeek.map(({ name, initial }) => {
          const isSelected = activeDay === name;

          return (
            <Pressable
              key={name}
              style={({ pressed }) => [
                styles.dayButton,
                isSelected && styles.selectedButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => handleDaySelect(name)}
            >
              {/* Day Initial Circle */}
              <View style={[
                styles.initialCircle,
                isSelected && styles.selectedInitialCircle
              ]}>
                <Text style={[
                  styles.initialText,
                  isSelected && styles.selectedInitialText
                ]}>
                  {initial}
                </Text>
              </View>

              {/* Day Name */}
              <Text style={[
                styles.dayButtonText,
                isSelected && styles.selectedButtonText
              ]}>
                {name}
              </Text>

              {/* Down Arrow */}
              <Ionicons 
                name="chevron-down" 
                size={20} 
                color={isSelected ? '#E53935' : '#777'} 
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
//Defiently check out Ionicons,

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 16,
    color: '#333',
  },
  dayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
    maxWidth: 400,
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
  initialText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  selectedInitialText: {
    color: '#FFFFFF',
  },
});

