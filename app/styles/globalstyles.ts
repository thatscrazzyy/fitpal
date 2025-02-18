import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#E53935',
  primaryDark: '#B71C1C',
  primaryLight: '#FFCDD2',
  secondary: '#FF5252',
  background: '#FFFFFF',
  text: '#212121',
  textLight: '#757575',
  accent: '#FF1744',
};

export const FONTS = {
  large: 42,
  medium: 18,
  small: 14,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Add more global styles here
});