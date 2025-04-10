import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNutrition } from '../contexts/NutritionContext';

const COMMON_FOODS = [
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: '1', servingUnit: 'medium' },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: '1', servingUnit: 'medium' },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100', servingUnit: 'g' },
  { name: 'Egg', calories: 72, protein: 6.3, carbs: 0.4, fat: 5, servingSize: '1', servingUnit: 'large' },
  { name: 'Oatmeal', calories: 166, protein: 5.9, carbs: 28, fat: 3.6, servingSize: '1', servingUnit: 'cup cooked' },
  { name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 13, servingSize: '100', servingUnit: 'g' },
];

const CustomTouchable = ({ style, onPress, children }) => (
  <Pressable style={({ pressed }) => [style, pressed && styles.buttonPressed]} onPress={onPress}>
    {children}
  </Pressable>
);

const AddFoodScreen = () => {
  const router = useRouter();
  const { mealType } = useLocalSearchParams();
  const { addFoodItem, foodHistory } = useNutrition();

  const currentMealType = (mealType || 'snack') as 'breakfast' | 'lunch' | 'dinner' | 'snack';

  const [formMode, setFormMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('');

  const mergedFoods = [...COMMON_FOODS, ...foodHistory];
  const uniqueFoods = mergedFoods.filter(
    (item, index, self) =>
      item.name.trim().length > 1 &&
      index === self.findIndex(f => f.name.toLowerCase().trim() === item.name.toLowerCase().trim())
  );
  const filteredFoods = uniqueFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setFormMode('detail');
  };

  const handleAddFoodSubmit = async () => {
    if (!selectedFood) return;

    try {
      await addFoodItem({
        ...selectedFood,
        timestamp: new Date().toISOString(),
        mealType: currentMealType,
      });
      console.log("Saved from common list");
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    }
  };

  const handleCustomFoodSubmit = async () => {
    if (!foodName.trim() || !calories.trim()) {
      Alert.alert('Missing Info', 'Please enter both food name and calories.');
      return;
    }

    const caloriesNum = parseFloat(calories.trim());
    const proteinNum = protein.trim() ? parseFloat(protein.trim()) : 0;
    const carbsNum = carbs.trim() ? parseFloat(carbs.trim()) : 0;
    const fatNum = fat.trim() ? parseFloat(fat.trim()) : 0;

    if (
      isNaN(caloriesNum) ||
      isNaN(proteinNum) ||
      isNaN(carbsNum) ||
      isNaN(fatNum)
    ) {
      Alert.alert(
        'Invalid Input',
        'Calories, protein, carbs, and fat must all be numeric values.'
      );
      return;
    }

    try {
      await addFoodItem({
        name: foodName.trim(),
        calories: caloriesNum,
        protein: proteinNum,
        carbs: carbsNum,
        fat: fatNum,
        servingSize: servingSize.trim() || '1',
        servingUnit: servingUnit.trim() || 'serving',
        timestamp: new Date().toISOString(),
        mealType: currentMealType,
      });
      console.log("Custom food saved:", foodName);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save custom food. Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {formMode === 'custom' ? 'Add Custom Food' : formMode === 'detail' ? 'Food Details' : 'Add Food'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {formMode === 'search' && (
          <ScrollView contentContainerStyle={styles.body}>
            <TextInput
              style={styles.input}
              placeholder="Search common foods..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {filteredFoods.map((food, i) => (
              <CustomTouchable key={i} style={styles.listItem} onPress={() => handleFoodSelect(food)}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.listMeta}>{food.calories} cal</Text>
              </CustomTouchable>
            ))}
            <TouchableOpacity onPress={() => setFormMode('custom')}>
              <Text style={styles.customLink}>+ Add Custom Food</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {formMode === 'custom' && (
          <ScrollView contentContainerStyle={styles.body}>
            <TextInput style={styles.input} placeholder="Food Name*" value={foodName} onChangeText={setFoodName} />
            <TextInput style={styles.input} placeholder="Calories*" keyboardType="numeric" value={calories} onChangeText={setCalories} />
            <TextInput style={styles.input} placeholder="Protein (g)" keyboardType="numeric" value={protein} onChangeText={setProtein} />
            <TextInput style={styles.input} placeholder="Carbs (g)" keyboardType="numeric" value={carbs} onChangeText={setCarbs} />
            <TextInput style={styles.input} placeholder="Fat (g)" keyboardType="numeric" value={fat} onChangeText={setFat} />
            <TextInput style={styles.input} placeholder="Serving Size" value={servingSize} onChangeText={setServingSize} />
            <TextInput style={styles.input} placeholder="Unit" value={servingUnit} onChangeText={setServingUnit} />
            <TouchableOpacity style={styles.button} onPress={handleCustomFoodSubmit}>
              <Text style={styles.buttonText}>Add Food</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {formMode === 'detail' && selectedFood && (
          <View style={styles.detailContainer}>
            <Text style={styles.detailName}>{selectedFood.name}</Text>
            <Text style={styles.detailCalories}>{selectedFood.calories} cal</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroItem}>🍗 Protein: {selectedFood.protein}g</Text>
              <Text style={styles.macroItem}>🍞 Carbs: {selectedFood.carbs}g</Text>
              <Text style={styles.macroItem}>🥑 Fat: {selectedFood.fat}g</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddFoodSubmit}>
              <Text style={styles.buttonText}>Add to Diary</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  body: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 14,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
  },
  foodName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500'
  },
  listMeta: {
    color: '#888',
    fontSize: 16,
  },
  customLink: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
  },
  foodTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#E53935',
    padding: 18,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  detailContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  detailCalories: {
    fontSize: 22,
    color: '#E53935',
    marginBottom: 24,
  },
  macroRow: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  macroItem: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
});

export default AddFoodScreen;
