import {
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function WorkoutGenerationScreen() {
  const handlePress = () => {
    if (Platform.OS === "ios") {
      console.log("iOS press");
    } else {
      console.log("Android press");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "light"} />
      <View style={styles.content}>
        <Text style={styles.title}>Fitpal Workout Generation</Text>

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Enter your measurements</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (in):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter height"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (lbs):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Weight (lbs):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter goal weight"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Intensity:</Text>
            <TextInput style={styles.input} placeholder="Enter intensity" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Length (mins):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter workout length"
              keyboardType="numeric"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>Generate Workout Plan</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#444",
  },
  formContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
