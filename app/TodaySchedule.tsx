import React, { useState } from 'react';
import { View,Text,StyleSheet,Platform,Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function routine_page() {
  const [selectedDay, setSelectedDay] = useState(null);

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const handleDayPress = (day) => {
    setSelectedDay(day);
    if (Platform.OS === 'ios') {
      console.log('iOS press:', day);
    } else {
      console.log('Android press:', day);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} />
      <View style={styles.content}>
        <Text style={styles.title}>
          Workout Routine
        </Text>

        {weekdays.map((day) => (
          <Pressable
            key={day}
            style={({pressed}) => [
              styles.button,
              Platform.OS === 'ios' ? styles.iosButton : styles.androidButton,
              pressed && styles.buttonPressed,
              selectedDay === day && styles.selectedButton
            ]}
            onPress={() => handleDayPress(day)}
          >
            <Text style={styles.buttonText}>
              {day}
            </Text>
          </Pressable>
          

        ))}
  
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignContent:'center',
    
    
  },
  title: {
    textAlign:'center',
    fontSize: Platform.OS === 'ios' ? 28 : 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    padding:40,
    minWidth:400,
    backgroundColor:"#2196F3"
    
  },
  button: {
    padding:20,
    borderRadius: Platform.OS === 'ios' ? 8 : 4,
    minWidth: 400,
    alignItems: 'center',
    backgroundColor: '#FFFFF',
    borderBottomWidth:2,
    borderBottomColor:'#2196F3',
    
  },
  iosButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  androidButton: {
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  selectedButton: {
    backgroundColor: Platform.OS === 'ios' ? '#808080' : '#808080',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  platformNote: {
    marginTop: 20,
    color: '#666',
    fontSize: Platform.OS === 'ios' ? 14 : 13,
  },

});
