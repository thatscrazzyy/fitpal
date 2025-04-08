import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNutrition } from '../contexts/NutritionContext';
import { FoodItem } from '../types/nutrition';

 
// Common food database - this would ideally come from an API
const COMMON_FOODS: Omit<FoodItem, 'id' | 'timestamp' | 'mealType'>[] = [
  {
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: '1',
    servingUnit: 'medium'
  },
  {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1',
    servingUnit: 'medium'
  },
  {
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100',
    servingUnit: 'g'
  },
  {
    name: 'Egg',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 5,
    servingSize: '1',
    servingUnit: 'large'
  },
  {
    name: 'Salmon',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: '100',
    servingUnit: 'g'
  },
  {
    name: 'Brown Rice',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1',
    servingUnit: 'cup cooked'
  },
  {
    name: 'Avocado',
    calories: 234,
    protein: 2.9,
    carbs: 12.5,
    fat: 21,
    servingSize: '1',
    servingUnit: 'medium'
  },
  {
    name: 'Greek Yogurt',
    calories: 100,
    protein: 10,
    carbs: 4,
    fat: 5,
    servingSize: '100',
    servingUnit: 'g'
  },
  {
    name: 'Oatmeal',
    calories: 166,
    protein: 5.9,
    carbs: 28,
    fat: 3.6,
    servingSize: '1',
    servingUnit: 'cup cooked'
  },
  {
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    servingSize: '1',
    servingUnit: 'medium'
  },
  {
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100',
    servingUnit: 'g'
  },
  {
    name: 'Almonds',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    servingSize: '1/4',
    servingUnit: 'cup'
  },
  {
    name: 'Protein Shake',
    calories: 120,
    protein: 25,
    carbs: 3,
    fat: 1,
    servingSize: '1',
    servingUnit: 'scoop'
  },
  {
    name: 'Whole Wheat Bread',
    calories: 81,
    protein: 4,
    carbs: 15,
    fat: 1.1,
    servingSize: '1',
    servingUnit: 'slice'
  }
];

// Custom touchable component
interface CustomTouchableProps {
  style?: any;
  onPress: () => void;
  children: React.ReactNode;
}

const CustomTouchable: React.FC<CustomTouchableProps> = ({ style, onPress, children }) => (
  <Pressable
    style={({ pressed }) => [
      style,
      pressed && styles.buttonPressed
    ]}
    onPress={onPress}
  >
    {children}
  </Pressable>
);

const AddFoodScreen: React.FC = () => {
  const router = useRouter();
  const { mealType } = useLocalSearchParams();
  const { addFoodItem, foodHistory } = useNutrition();
  
  // Form state
  const [searchQuery, setSearchQuery] = useState('');
  const [formMode, setFormMode] = useState<'search' | 'custom' | 'detail'>('search');
  const [selectedFood, setSelectedFood] = useState<Omit<FoodItem, 'id' | 'timestamp' | 'mealType'> | null>(null);
  
  // Custom food form
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('');
  
  // Filter foods based on search query
  const filteredFoods = [...COMMON_FOODS, ...(formMode === 'search' ? foodHistory : [])]
    .filter(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 20); // Limit results
  
  const handleFoodSelect = (food: Omit<FoodItem, 'id' | 'timestamp' | 'mealType'>) => {
    setSelectedFood(food);
    setFormMode('detail');
  };
  
  const handleAddFoodSubmit = async () => {
    if (!selectedFood) return;
    
    try {
      await addFoodItem({
        ...selectedFood,
        timestamp: new Date().toISOString(),
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      });
      
      router.back();
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    }
  };
  
  const handleCustomFoodSubmit = async () => {
    // Validate the form
    if (!foodName || !calories) {
      Alert.alert('Missing Information', 'Food name and calories are required.');
      return;
    }
    
    const caloriesNum = parseInt(calories);
    const proteinNum = protein ? parseFloat(protein) : 0;
    const carbsNum = carbs ? parseFloat(carbs) : 0;
    const fatNum = fat ? parseFloat(fat) : 0;
    
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid calorie value.');
      return;
    }
    
    try {
      await addFoodItem({
        name: foodName,
        calories: caloriesNum,
        protein: proteinNum,
        carbs: carbsNum,
        fat: fatNum,
        servingSize: servingSize || '1',
        servingUnit: servingUnit || 'serving',
        timestamp: new Date().toISOString(),
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      });
      
      router.back();
    } catch (error) {
      console.error('Error adding custom food:', error);
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    }
  };
  
  // Render the search screen
  const renderSearchScreen = () => (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={18} color="#777" />
            </TouchableOpacity>
          )}
        </View>
        
        <CustomTouchable
          style={styles.customFoodButton}
          onPress={() => setFormMode('custom')}
        >
          <Ionicons name="add-circle-outline" size={20} color="#E53935" />
          <Text style={styles.customFoodButtonText}>Custom Food</Text>
        </CustomTouchable>
      </View>
      
      {filteredFoods.length > 0 ? (
        <FlatList
          data={filteredFoods}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <CustomTouchable
              style={styles.foodListItem}
              onPress={() => handleFoodSelect(item)}
            >
              <View style={styles.foodItemContent}>
                <Text style={styles.foodItemName}>{item.name}</Text>
                <Text style={styles.foodItemServing}>
                  {item.servingSize} {item.servingUnit}
                </Text>
              </View>
              <View style={styles.foodItemCalories}>
                <Text style={styles.caloriesText}>{item.calories}</Text>
                <Text style={styles.caloriesLabel}>cal</Text>
              </View>
            </CustomTouchable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.foodList}
        />
      ) : (
        <View style={styles.emptyResultsContainer}>
          {searchQuery.length > 0 ? (
            <>
              <Ionicons name="search" size={36} color="#CCC" />
              <Text style={styles.emptyResultsText}>No foods found</Text>
              <Text style={styles.emptyResultsSubtext}>
                Try a different search term or add a custom food.
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="nutrition-outline" size={36} color="#CCC" />
              <Text style={styles.emptyResultsText}>Search for a food</Text>
              <Text style={styles.emptyResultsSubtext}>
                Type a food name above or add a custom food item.
              </Text>
            </>
          )}
        </View>
      )}
    </>
  );
  
  // Render the custom food form
  const renderCustomFoodForm = () => (
    <ScrollView contentContainerStyle={styles.customFormContainer}>
      <Text style={styles.formSectionTitle}>Add Custom Food</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Food Name*</Text>
        <TextInput
          style={styles.formInput}
          placeholder="e.g. Homemade Smoothie"
          placeholderTextColor="#999"
          value={foodName}
          onChangeText={setFoodName}
        />
      </View>
      
      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Serving Size</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. 1"
            placeholderTextColor="#999"
            value={servingSize}
            onChangeText={setServingSize}
            keyboardType="numeric"
          />
        </View>
        
        <View style={[styles.formGroup, { flex: 1.5 }]}>
          <Text style={styles.inputLabel}>Unit</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. cup"
            placeholderTextColor="#999"
            value={servingUnit}
            onChangeText={setServingUnit}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Calories*</Text>
        <TextInput
          style={styles.formInput}
          placeholder="e.g. 150"
          placeholderTextColor="#999"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
      </View>
      
      <Text style={styles.formSectionTitle}>Macronutrients (g)</Text>
      
      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Protein</Text>
          <TextInput
            style={styles.formInput}
            placeholder="0"
            placeholderTextColor="#999"
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
          />
        </View>
        
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Carbs</Text>
          <TextInput
            style={styles.formInput}
            placeholder="0"
            placeholderTextColor="#999"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />
        </View>
        
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Fat</Text>
          <TextInput
            style={styles.formInput}
            placeholder="0"
            placeholderTextColor="#999"
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.formActions}>
        <CustomTouchable
          style={styles.cancelButton}
          onPress={() => setFormMode('search')}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </CustomTouchable>
        
        <CustomTouchable
          style={styles.saveButton}
          onPress={handleCustomFoodSubmit}
        >
          <Text style={styles.saveButtonText}>Add Food</Text>
        </CustomTouchable>
      </View>
    </ScrollView>
  );
  
  // Render the food detail screen
  const renderFoodDetailScreen = () => {
    if (!selectedFood) return null;
    
    return (
      <View style={styles.detailContainer}>
        <View style={styles.foodDetailHeader}>
          <Text style={styles.foodDetailName}>{selectedFood.name}</Text>
          <View style={styles.servingDetail}>
            <Text style={styles.servingSize}>
              {selectedFood.servingSize} {selectedFood.servingUnit}
            </Text>
          </View>
        </View>
        
        <View style={styles.nutritionContainer}>
          <View style={styles.caloriesDetail}>
            <Text style={styles.caloriesValue}>{selectedFood.calories}</Text>
            <Text style={styles.caloriesDetailLabel}>Calories</Text>
          </View>
          
          <View style={styles.macrosDetail}>
            <View style={styles.macroDetailItem}>
              <Text style={styles.macroDetailValue}>{selectedFood.protein}g</Text>
              <Text style={styles.macroDetailLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroDetailItem}>
              <Text style={styles.macroDetailValue}>{selectedFood.carbs}g</Text>
              <Text style={styles.macroDetailLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroDetailItem}>
              <Text style={styles.macroDetailValue}>{selectedFood.fat}g</Text>
              <Text style={styles.macroDetailLabel}>Fat</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.formActions}>
          <CustomTouchable
            style={styles.cancelButton}
            onPress={() => setFormMode('search')}
          >
            <Text style={styles.cancelButtonText}>Back</Text>
          </CustomTouchable>
          
          <CustomTouchable
            style={styles.saveButton}
            onPress={handleAddFoodSubmit}
          >
            <Text style={styles.saveButtonText}>Add to Diary</Text>
          </CustomTouchable>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {formMode === 'custom' ? 'Add Custom Food' : 
             formMode === 'detail' ? 'Food Details' : 
             `Add Food to ${
                mealType === 'breakfast' ? 'Breakfast' :
                mealType === 'lunch' ? 'Lunch' :
                mealType === 'dinner' ? 'Dinner' : 'Snacks'
             }`}
          </Text>
          <View style={styles.iconPlaceholder} />
        </View>
        
        <View style={styles.content}>
          {formMode === 'search' && renderSearchScreen()}
          {formMode === 'custom' && renderCustomFoodForm()}
          {formMode === 'detail' && renderFoodDetailScreen()}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  customFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
  },
  customFoodButtonText: {
    fontSize: 15,
    color: '#E53935',
    marginLeft: 6,
    fontWeight: '500',
  },
  foodList: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  foodListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  foodItemContent: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  foodItemServing: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  foodItemCalories: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#777',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#777',
    marginTop: 16,
  },
  emptyResultsSubtext: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  // Custom Food Form
  customFormContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  // Food Detail
  detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  foodDetailHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  foodDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  servingDetail: {
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  servingSize: {
    fontSize: 15,
    color: '#555',
  },
  nutritionContainer: {
    marginBottom: 24,
  },
  caloriesDetail: {
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E53935',
  },
  caloriesDetailLabel: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  macrosDetail: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingVertical: 16,
  },
  macroDetailItem: {
    alignItems: 'center',
  },
  macroDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  macroDetailLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default AddFoodScreen;