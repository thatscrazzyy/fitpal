import React from 'react';
import { StyleSheet, View, Text, Platform, Pressable, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';

// This is the main Screm 
export default function WorkoutScreen() {
  const generateWorkout = () => {
    console.log(`Generating workout for ${Platform.OS.toUpperCase()}...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* The Top Red Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FitPal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Generate Your Workout</Text>
        <Text style={styles.subtitle}>Fill in the details below</Text>

        {/* Input Fields, add any new fields in the same way */}
        <View style={styles.form}>
          <InputField label="Height (in):" icon="body-outline" placeholder="e.g. 70" />
          <InputField label="Weight (lbs):" icon="fitness-outline" placeholder="e.g. 160" />
          <InputField label="Goal Weight (lbs):" icon="trending-down-outline" placeholder="e.g. 150" />
          <InputField label="Intensity Level:" icon="flame-outline" placeholder="Low / Medium / High" />
          <InputField label="Workout Length (mins):" icon="time-outline" placeholder="e.g. 45" />

          {/* Generate Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.generateButton, 
              pressed ? styles.buttonPressed : {}
            ]}
            onPress={generateWorkout}
          >
            <Ionicons name="barbell-outline" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Generate</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// The InputField component
const InputField = ({ label, icon, placeholder }) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={20} color="#E53935" />
      <Text style={styles.label}>{label}</Text>
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType="numeric"
    />
  </View>
);


//these are all the styles/color componenets used on this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", 
  },
  form: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 50, 
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
    marginLeft: 6,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: "#E53935",
    borderRadius: 25,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
  },
});

