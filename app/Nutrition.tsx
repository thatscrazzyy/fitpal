
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNutrition } from '../contexts/NutritionContext';
import { FoodItem } from '../types/nutrition';

interface CustomTouchableProps {
  style?: any;
  onPress: () => void;
  children: React.ReactNode;
}

const CustomTouchable: React.FC<CustomTouchableProps> = ({ style, onPress, children }) => (
  <Pressable
    style={({ pressed }) => [style, pressed && styles.buttonPressed]}
    onPress={onPress}
  >
    {children}
  </Pressable>
);

const NutritionScreen: React.FC = () => {
  const router = useRouter();
  const { dailyNutrition, calorieGoal, removeFoodItem, updateCalorieGoal } = useNutrition();
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(calorieGoal.toString());

  if (!dailyNutrition) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Nutrition Tracker</Text>
          <View style={styles.iconPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading nutrition data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const remainingCalories = dailyNutrition.goal - dailyNutrition.totalCalories;
  const caloriePercentage = (dailyNutrition.totalCalories / dailyNutrition.goal) * 100;

  const handleRemoveItem = (item: FoodItem, mealType: string) => {
    Alert.alert(
      'Remove Food Item',
      `Are you sure you want to remove ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => removeFoodItem(item.id, mealType),
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditGoal = () => {
    setNewGoal(calorieGoal.toString());
    setEditingGoal(true);
  };

  const renderMealSection = (
    title: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    const items = dailyNutrition.meals[mealType];
    const mealTotalCalories = items.reduce((sum, item) => sum + item.calories, 0);

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <Ionicons
              name={
                mealType === 'breakfast'
                  ? 'sunny-outline'
                  : mealType === 'lunch'
                  ? 'restaurant-outline'
                  : mealType === 'dinner'
                  ? 'moon-outline'
                  : 'cafe-outline'
              }
              size={20}
              color="#E53935"
            />
            <Text style={styles.mealTitle}>{title}</Text>
          </View>
          <Text style={styles.mealCalories}>{mealTotalCalories} cal</Text>
        </View>

        {items.length > 0 ? (
          <View>
            {items.map((item) => (
              <View key={item.id} style={styles.foodItem}>
                <View style={styles.foodItemDetails}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodServing}>
                    {item.servingSize} {item.servingUnit}
                  </Text>
                </View>
                <View style={styles.foodItemNutrition}>
                  <Text style={styles.foodCalories}>{item.calories} cal</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item, mealType)}
                  >
                    <Ionicons name="close-circle" size={20} color="#777" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyMealText}>No foods added yet</Text>
        )}

        <CustomTouchable
          style={styles.addFoodButton}
          onPress={() => router.push(`AddFood?mealType=${mealType}`)}
        >
          <Ionicons name="add" size={18} color="#E53935" />
          <Text style={styles.addFoodButtonText}>Add Food</Text>
        </CustomTouchable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Nutrition Tracker</Text>
        <View style={styles.iconPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.calorieSummary}>
          <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
              <Text style={styles.summaryTitle}>Daily Calorie Goal</Text>
              <TouchableOpacity style={styles.editGoalButton} onPress={handleEditGoal}>
                <Ionicons name="pencil-outline" size={18} color="#777" />
              </TouchableOpacity>
            </View>

            {editingGoal ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    fontSize: 20,
                    flex: 1,
                    marginRight: 10,
                    padding: 4,
                  }}
                  value={newGoal}
                  onChangeText={setNewGoal}
                  keyboardType="numeric"
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => {
                    const goal = parseInt(newGoal || '0');
                    if (goal > 0) {
                      updateCalorieGoal(goal);
                      setEditingGoal(false);
                    } else {
                      Alert.alert('Invalid Input', 'Please enter a valid calorie goal.');
                    }
                  }}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#43A047" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingGoal(false)}>
                  <Ionicons name="close-circle" size={24} color="#E53935" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.calorieGoal}>{calorieGoal} cal</Text>
            )}
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.calorieContainer}>
              <Text style={styles.calorieConsumed}>{dailyNutrition.totalCalories}</Text>
              <Text style={styles.calorieLabel}>Consumed</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calorieContainer}>
              <Text
                style={[
                  styles.calorieRemaining,
                  remainingCalories < 0 ? styles.calorieNegative : {},
                ]}
              >
                {remainingCalories}
              </Text>
              <Text style={styles.calorieLabel}>Remaining</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(caloriePercentage, 100)}%` },
                  caloriePercentage > 100 ? styles.progressOverflow : {},
                ]}
              />
            </View>
            <Text style={styles.progressText}>{caloriePercentage.toFixed(0)}% of daily goal</Text>
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{dailyNutrition.totalProtein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{dailyNutrition.totalCarbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{dailyNutrition.totalFat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Meals</Text>

        {renderMealSection('Breakfast', 'breakfast')}
        {renderMealSection('Lunch', 'lunch')}
        {renderMealSection('Dinner', 'dinner')}
        {renderMealSection('Snacks', 'snack')}
      </ScrollView>
    </SafeAreaView>
  );
};

// 🎨 All existing styles stay the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconPlaceholder: { width: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#555' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  calorieSummary: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalContainer: { marginBottom: 16 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#555' },
  editGoalButton: { padding: 4 },
  calorieGoal: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 4 },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieContainer: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: '#E0E0E0' },
  calorieConsumed: { fontSize: 22, fontWeight: 'bold', color: '#E53935' },
  calorieRemaining: { fontSize: 22, fontWeight: 'bold', color: '#43A047' },
  calorieNegative: { color: '#F44336' },
  calorieLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  progressContainer: { marginBottom: 16 },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#43A047', borderRadius: 5 },
  progressOverflow: { backgroundColor: '#F44336' },
  progressText: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 4 },
  macrosContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  macroItem: { alignItems: 'center' },
  macroValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  macroLabel: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  mealSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  mealTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 8 },
  mealCalories: { fontSize: 16, fontWeight: '600', color: '#E53935' },
  emptyMealText: { color: '#999', fontStyle: 'italic', marginBottom: 12 },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  foodItemDetails: { flex: 1 },
  foodName: { fontSize: 15, color: '#333' },
  foodServing: { fontSize: 13, color: '#888', marginTop: 2 },
  foodItemNutrition: { flexDirection: 'row', alignItems: 'center' },
  foodCalories: { fontSize: 15, fontWeight: '500', color: '#555', marginRight: 8 },
  removeButton: { padding: 4 },
  addFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addFoodButtonText: { fontSize: 15, color: '#E53935', marginLeft: 6 },
  buttonPressed: { opacity: 0.8 },
});

export default NutritionScreen;
