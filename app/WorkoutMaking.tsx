// app/WorkoutMaking.tsx

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  Pressable, 
  TextInput, 
  ScrollView, 
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { generateWorkoutWithOpenAI } from '../services/openaiService';
import { useWorkout } from '../contexts/WorkoutContext';
import { UserData } from '../types/workout';

const { width } = Dimensions.get('window');

// Define interface for InputField props
interface InputFieldProps {
  label: string;
  icon: typeof Ionicons.defaultProps.name;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

// Define interface for custom touchable props
interface CustomTouchableProps {
  style?: any;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

// Define interface for dropdown props
interface DropdownProps {
  label: string;
  icon: typeof Ionicons.defaultProps.name;
  value: string;
  onSelect: (value: string) => void;
  options: {label: string; value: string; color?: string}[];
}

export default function WorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setWorkoutPlan } = useWorkout();
  const [loading, setLoading] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];
  
  // Check if we're in edit mode
  const isEditMode = params.editMode === 'true';
  
  // Form state
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [intensity, setIntensity] = useState('');
  const [duration, setDuration] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [equipmentAvailable, setEquipmentAvailable] = useState('');
  const [step, setStep] = useState(0);

  // Define form steps
  const totalSteps = 7;
  
  // Initialize form values from params if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setHeight(params.height as string || '');
      setWeight(params.weight as string || '');
      setGoalWeight(params.goalWeight as string || '');
      setIntensity(params.intensity as string || '');
      setDuration(params.duration as string || '');
      setAge(params.age as string || '');
      setGender(params.gender as string || '');
      setFitnessLevel(params.fitnessLevel as string || '');
      setPrimaryGoal(params.primaryGoal as string || '');
      setEquipmentAvailable(params.equipmentAvailable as string || '');
    }
  }, [isEditMode, params]);
  
  const animateSlide = (direction: 'next' | 'prev') => {
    // First slide off screen
    Animated.timing(slideAnim, {
      toValue: direction === 'next' ? -width : width,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      // Update step
      setStep(prev => direction === 'next' ? prev + 1 : prev - 1);
      
      // Reset position to start from the other side
      slideAnim.setValue(direction === 'next' ? width : -width);
      
      // Slide into center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start();
    });
  };
  
  const nextStep = () => {
    // Validate current step
    if (validateCurrentStep()) {
      if (step < totalSteps - 1) {
        animateSlide('next');
      } else {
        // All done, generate workout
        generateWorkout();
      }
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      animateSlide('prev');
    } else if (isEditMode) {
      // Go back to results if in edit mode
      router.back();
    }
  };
  
  const validateCurrentStep = (): boolean => {
    // Different validation for each step
    switch(step) {
      case 0: // Age and Gender
        if (!age || !gender) {
          Alert.alert('Missing Information', 'Please enter your age and select your gender.');
          return false;
        }
        if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
          Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 120.');
          return false;
        }
        return true;
        
      case 1: // Height and Weight
        if (!height || !weight) {
          Alert.alert('Missing Information', 'Please enter both height and weight.');
          return false;
        }
        if (isNaN(Number(height)) || Number(height) <= 0) {
          Alert.alert('Invalid Height', 'Please enter a valid height.');
          return false;
        }
        if (isNaN(Number(weight)) || Number(weight) <= 0) {
          Alert.alert('Invalid Weight', 'Please enter a valid weight.');
          return false;
        }
        return true;
        
      case 2: // Goal Weight
        if (!goalWeight) {
          Alert.alert('Missing Information', 'Please enter your goal weight.');
          return false;
        }
        if (isNaN(Number(goalWeight)) || Number(goalWeight) <= 0) {
          Alert.alert('Invalid Goal Weight', 'Please enter a valid goal weight.');
          return false;
        }
        return true;
        
      case 3: // Fitness Level
        if (!fitnessLevel) {
          Alert.alert('Missing Information', 'Please select your fitness level.');
          return false;
        }
        return true;
        
      case 4: // Primary Goal
        if (!primaryGoal) {
          Alert.alert('Missing Information', 'Please select your primary fitness goal.');
          return false;
        }
        return true;
        
      case 5: // Equipment Available
        if (!equipmentAvailable) {
          Alert.alert('Missing Information', 'Please select your available equipment.');
          return false;
        }
        return true;
        
      case 6: // Intensity and Duration
        if (!intensity || !duration) {
          Alert.alert('Missing Information', 'Please select intensity level and workout duration.');
          return false;
        }
        if (isNaN(Number(duration)) || Number(duration) <= 0 || Number(duration) > 180) {
          Alert.alert('Invalid Duration', 'Please enter a valid duration between 1 and 180 minutes.');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  const validateForm = (): boolean => {
    // Complete validation of all fields
    if (!height || !weight || !goalWeight || !intensity || !duration || 
        !age || !gender || !fitnessLevel || !primaryGoal || !equipmentAvailable) {
      Alert.alert('Missing Information', 'Please fill in all fields to generate your workout plan.');
      return false;
    }
    
    // Check numeric fields
    if (isNaN(Number(height)) || isNaN(Number(weight)) || 
        isNaN(Number(goalWeight)) || isNaN(Number(duration)) || 
        isNaN(Number(age))) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for height, weight, age, goal weight, and duration.');
      return false;
    }
    
    return true;
  };

  const generateWorkout = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Prepare user data for the API
      const userData: UserData = {
        height: Number(height),
        weight: Number(weight),
        goalWeight: Number(goalWeight),
        intensity: intensity,
        duration: Number(duration),
        age: Number(age),
        gender: gender,
        fitnessLevel: fitnessLevel,
        primaryGoal: primaryGoal,
        availableEquipment: equipmentAvailable
      };
      
      // Call the OpenAI service
      const workoutPlan = await generateWorkoutWithOpenAI(userData);
      
      // Store the workout plan in context
      setWorkoutPlan(workoutPlan);
      
      // Navigate to the results screen
      router.push('/WorkoutResults');
    } catch (error) {
      console.error('Error generating workout:', error);
      Alert.alert(
        'Error',
        'Something went wrong while generating your workout. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <InputField 
              label="Age:" 
              icon="calendar-outline" 
              placeholder="e.g. 30" 
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            
            <GenericDropdown
              label="Gender:"
              icon="person-outline"
              value={gender}
              onSelect={setGender}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' }
              ]}
            />
          </>
        );
        
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>What are your measurements?</Text>
            <InputField 
              label="Height (in):" 
              icon="resize-outline" 
              placeholder="e.g. 70" 
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
            
            <InputField 
              label="Weight (lbs):" 
              icon="fitness-outline" 
              placeholder="e.g. 160" 
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </>
        );
        
      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>What's your goal weight?</Text>
            <InputField 
              label="Goal Weight (lbs):" 
              icon="trending-down-outline" 
              placeholder="e.g. 150" 
              value={goalWeight}
              onChangeText={setGoalWeight}
              keyboardType="numeric"
            />
            <Text style={styles.fieldDescription}>
              Your goal weight helps us determine whether your workout plan should focus on weight loss, 
              maintenance, or muscle gain.
            </Text>
          </>
        );
        
      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>What's your fitness level?</Text>
            <GenericDropdown
              label="Fitness Level:"
              icon="body-outline"
              value={fitnessLevel}
              onSelect={setFitnessLevel}
              options={[
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' }
              ]}
            />
            <Text style={styles.fieldDescription}>
              This helps us adjust the difficulty of exercises and the complexity of your workout routine.
            </Text>
          </>
        );
        
      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>What's your primary goal?</Text>
            <GenericDropdown
              label="Primary Goal:"
              icon="trophy-outline"
              value={primaryGoal}
              onSelect={setPrimaryGoal}
              options={[
                { label: 'Weight Loss', value: 'Weight Loss' },
                { label: 'Muscle Gain', value: 'Muscle Gain' },
                { label: 'Strength', value: 'Strength' },
                { label: 'Endurance', value: 'Endurance' },
                { label: 'General Fitness', value: 'General Fitness' }
              ]}
            />
            <Text style={styles.fieldDescription}>
              Your primary goal will determine the types of exercises and workout structure we recommend.
            </Text>
          </>
        );
        
      case 5:
        return (
          <>
            <Text style={styles.stepTitle}>What equipment do you have?</Text>
            <GenericDropdown
              label="Available Equipment:"
              icon="barbell-outline"
              value={equipmentAvailable}
              onSelect={setEquipmentAvailable}
              options={[
                { label: 'Full Commercial Gym', value: 'Full Commercial Gym' },
                { label: 'Home Gym (Some Equipment)', value: 'Home Gym' },
                { label: 'Minimal Equipment', value: 'Minimal Equipment' },
                { label: 'No Equipment (Bodyweight Only)', value: 'No Equipment' }
              ]}
            />
            <Text style={styles.fieldDescription}>
              We'll tailor exercises based on your available equipment to ensure you can complete your workouts.
            </Text>
          </>
        );
        
      case 6:
        return (
          <>
            <Text style={styles.stepTitle}>Workout preferences</Text>
            <IntensityDropdown
              label="Intensity Level:"
              icon="flame-outline"
              value={intensity}
              onSelect={setIntensity}
            />
            
            <InputField 
              label="Workout Length (mins):" 
              icon="time-outline" 
              placeholder="e.g. 45" 
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <Text style={styles.fieldDescription}>
              Intensity and duration determine how challenging and long your workouts will be.
            </Text>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* The Top Red Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FitPal</Text>
      </View>

      <View style={styles.progressContainer}>
        {Array(totalSteps).fill(0).map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot, 
              index <= step ? styles.progressDotActive : {}
            ]} 
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Animated.View style={[styles.form, { transform: [{ translateX: slideAnim }] }]}>
            {renderStepContent()}
          </Animated.View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <CustomTouchable 
            style={styles.backButton}
            onPress={prevStep}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.backButtonText}>Back</Text>
          </CustomTouchable>
          
          <CustomTouchable 
            style={styles.nextButton}
            onPress={nextStep}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {step === totalSteps - 1 ? 
                    (isEditMode ? 'Update' : 'Generate') : 
                    'Next'
                  }
                </Text>
                <Ionicons 
                  name={step === totalSteps - 1 ? 
                    (isEditMode ? "refresh-outline" : "barbell-outline") : 
                    "arrow-forward"
                  } 
                  size={20} 
                  color="#FFF" 
                />
              </>
            )}
          </CustomTouchable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Generic Dropdown component for select fields
const GenericDropdown: React.FC<DropdownProps> = ({ 
  label, 
  icon, 
  value, 
  onSelect,
  options
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color="#E53935" />
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.dropdownValueContainer}>
          {value ? (
            <Text style={styles.dropdownValue}>{value}</Text>
          ) : (
            <Text style={styles.dropdownPlaceholder}>Select an option</Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color="#777" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label.replace(':', '')}</Text>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {value === item.value && (
                    <Ionicons name="checkmark" size={20} color="#E53935" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// The IntensityDropdown component
const IntensityDropdown: React.FC<{ 
  label: string;
  icon: typeof Ionicons.defaultProps.name;
  value: string;
  onSelect: (value: string) => void;
}> = ({ 
  label, 
  icon, 
  value, 
  onSelect 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const intensityOptions = [
    { label: 'Low', value: 'Low', color: '#8BC34A' },  // Light green
    { label: 'Medium', value: 'Medium', color: '#FFC107' },  // Amber
    { label: 'High', value: 'High', color: '#FF5722' }  // Deep orange
  ];
  
  // Find the selected option to get its color
  const selectedOption = intensityOptions.find(option => option.value === value) || intensityOptions[0];
  
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color="#E53935" />
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.dropdownValueContainer}>
          {value ? (
            <View style={styles.selectedIntensity}>
              <View 
                style={[
                  styles.intensityDot, 
                  { backgroundColor: selectedOption.color }
                ]} 
              />
              <Text style={styles.dropdownValue}>{value}</Text>
            </View>
          ) : (
            <Text style={styles.dropdownPlaceholder}>Select intensity level</Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color="#777" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Intensity</Text>
            
            <FlatList
              data={intensityOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <View 
                    style={[
                      styles.intensityDot, 
                      { backgroundColor: item.color }
                    ]} 
                  />
                  <Text style={styles.optionText}>{item.label}</Text>
                  {value === item.value && (
                    <Ionicons name="checkmark" size={20} color="#E53935" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// The InputField component
const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChangeText,
  keyboardType = 'default'
}) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={20} color="#E53935" />
      <Text style={styles.label}>{label}</Text>
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

// Custom touchable component with a different name to avoid conflicts
const CustomTouchable: React.FC<CustomTouchableProps> = ({ 
  style, 
  onPress, 
  children,
  disabled = false
}) => (
  <Pressable
    style={({ pressed }) => [
      style,
      pressed && !disabled ? styles.buttonPressed : {},
      disabled && styles.buttonDisabled
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", 
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
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
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#E53935',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
    minHeight: '100%',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    fontStyle: 'italic',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
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
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: "#999",
  },
  // Dropdown styles
  dropdownTrigger: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValueContainer: {
    flex: 1,
  },
  dropdownValue: {
    fontSize: 15,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
  },
  selectedIntensity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});