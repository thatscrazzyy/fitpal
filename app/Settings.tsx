// app/Settings.tsx

import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Switch, 
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './styles/globalstyles';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsScreen(): JSX.Element {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');

  const toggleUseOpenAI = async () => {
    await updateSettings({ useOpenAI: !settings.useOpenAI });
  };

  const toggleDarkMode = async () => {
    await updateSettings({ darkModeEnabled: !settings.darkModeEnabled });
  };

  const toggleNotifications = async () => {
    await updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const toggleMetricUnits = async () => {
    await updateSettings({ metricUnits: !settings.metricUnits });
  };

  const saveApiKey = async () => {
    await updateSettings({ apiKey });
    setShowApiKeyModal(false);
    Alert.alert('Success', 'API key saved successfully.');
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          onPress: async () => {
            await resetSettings();
            Alert.alert('Success', 'Settings have been reset to defaults.');
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingsContainer}>
          {/* App Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <SettingItem 
              icon="moon-outline" 
              title="Dark Mode" 
              rightElement={
                <Switch
                  value={settings.darkModeEnabled}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#D1D1D6', true: '#FFCDD2' }}
                  thumbColor={settings.darkModeEnabled ? COLORS.primary : '#F4F3F4'}
                />
              }
            />
            
            <SettingItem 
              icon="notifications-outline" 
              title="Notifications" 
              rightElement={
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#D1D1D6', true: '#FFCDD2' }}
                  thumbColor={settings.notificationsEnabled ? COLORS.primary : '#F4F3F4'}
                />
              }
            />
            
            <SettingItem 
              icon="speedometer-outline" 
              title="Use Metric Units" 
              subtitle="Display measurements in cm/kg instead of in/lbs"
              rightElement={
                <Switch
                  value={settings.metricUnits}
                  onValueChange={toggleMetricUnits}
                  trackColor={{ false: '#D1D1D6', true: '#FFCDD2' }}
                  thumbColor={settings.metricUnits ? COLORS.primary : '#F4F3F4'}
                />
              }
            />
          </View>
          
          {/* AI Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Configuration</Text>
            
            <SettingItem 
              icon="cloud-outline" 
              title="Use OpenAI API" 
              subtitle="Generate workouts with AI"
              rightElement={
                <Switch
                  value={settings.useOpenAI}
                  onValueChange={toggleUseOpenAI}
                  trackColor={{ false: '#D1D1D6', true: '#FFCDD2' }}
                  thumbColor={settings.useOpenAI ? COLORS.primary : '#F4F3F4'}
                />
              }
            />
            
            <SettingItem 
              icon="key-outline" 
              title="OpenAI API Key" 
              subtitle={settings.apiKey ? "API key is set" : "Set your OpenAI API key"}
              onPress={() => setShowApiKeyModal(true)}
              showArrow
            />
          </View>
          
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <SettingItem 
              icon="person-outline" 
              title="Profile" 
              showArrow
            />
            
            <SettingItem 
              icon="lock-closed-outline" 
              title="Privacy" 
              showArrow
            />
          </View>
          
          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <SettingItem 
              icon="help-circle-outline" 
              title="Help Center" 
              showArrow
            />
            
            <SettingItem 
              icon="information-circle-outline" 
              title="About" 
              subtitle="Version 1.0.0"
              showArrow
            />
          </View>
          
          {/* Reset Settings Button */}
          <CustomTouchable 
            style={styles.resetButton}
            onPress={handleResetSettings}
          >
            <Ionicons name="refresh-outline" size={20} color="#E57373" />
            <Text style={styles.resetButtonText}>Reset All Settings</Text>
          </CustomTouchable>
          
          {/* Sign Out Button */}
          <CustomTouchable 
            style={styles.signOutButton}
            onPress={() => console.log('Sign out pressed')}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </CustomTouchable>
        </View>
      </ScrollView>
      
      {/* API Key Modal */}
      <Modal
        visible={showApiKeyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApiKeyModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>OpenAI API Key</Text>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowApiKeyModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            
            <Text style={styles.modalDescription}>
              Enter your OpenAI API key to generate personalized workout plans. You can get an API key from the OpenAI website.
            </Text>
            
            <TextInput
              style={styles.apiKeyInput}
              placeholder="Enter your OpenAI API key here"
              placeholderTextColor="#999"
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
            />
            
            <Text style={styles.securityNote}>
              Your API key is stored securely on your device only.
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <Pressable 
                style={styles.cancelButton}
                onPress={() => setShowApiKeyModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={styles.saveButton}
                onPress={saveApiKey}
              >
                <Text style={styles.saveButtonText}>Save Key</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// Custom Touchable component with a renamed identifier to avoid conflicts
const CustomTouchable = ({ style, onPress, children }) => (
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

// Setting item component
const SettingItem = ({ icon, title, subtitle, rightElement, showArrow, onPress }) => (
  <CustomTouchable
    style={styles.settingItem}
    onPress={onPress || (() => console.log(`${title} pressed`))}
  >
    <View style={styles.settingIconContainer}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
    </View>
    
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    
    <View style={styles.settingRight}>
      {rightElement || (showArrow && 
        <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
      )}
    </View>
  </CustomTouchable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  settingsContainer: {
    marginBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 3,
  },
  settingRight: {
    marginLeft: 8,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  resetButtonText: {
    color: '#E57373',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  apiKeyInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  securityNote: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});