import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Switch, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './styles/globalstyles';

export default function SettingsScreen(): JSX.Element {
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

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
                  value={darkModeEnabled}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#D1D1D6', true: '#FFCDD2' }}
                  thumbColor={darkModeEnabled ? COLORS.primary : '#F4F3F4'}
                />
              }
            />
            
            <SettingItem 
              icon="notifications-outline" 
              title="Notifications" 
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#D1D1D6', true: '#FFCDD2' }}
                  thumbColor={notificationsEnabled ? COLORS.primary : '#F4F3F4'}
                />
              }
            />
            
            <SettingItem 
              icon="language-outline" 
              title="Language" 
              subtitle="English (US)"
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
            
            <SettingItem 
              icon="shield-outline" 
              title="Security" 
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
              icon="chatbubble-outline" 
              title="Contact Us" 
              showArrow
            />
            
            <SettingItem 
              icon="information-circle-outline" 
              title="About" 
              subtitle="Version 1.0.0"
              showArrow
            />
          </View>
          
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
const SettingItem = ({ icon, title, subtitle, rightElement, showArrow }) => (
  <CustomTouchable
    style={styles.settingItem}
    onPress={() => console.log(`${title} pressed`)}
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
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
});