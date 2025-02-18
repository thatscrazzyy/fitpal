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
            Platform.OS === "ios" ? styles.iosButton : styles.androidButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Generate Workout</Text>
        </Pressable>

        <Text style={styles.platformNote}>
          {Platform.OS === "ios"
            ? "Using iOS-specific styling"
            : "Using Material Design styling"}
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 28 : 24,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: Platform.OS === "ios" ? 24 : 20,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: Platform.OS === "ios" ? 8 : 4,
    minWidth: 200,
    alignItems: "center",
    marginVertical: 10,
  },
  iosButton: {
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  androidButton: {
    backgroundColor: "#2196F3",
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  platformNote: {
    marginTop: 20,
    color: "#666",
    fontSize: Platform.OS === "ios" ? 14 : 13,
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
});
