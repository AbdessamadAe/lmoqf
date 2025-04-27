// A centralized theme system to ensure consistency across the app
import { Platform } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18, 
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const lightTheme = {
  colors: {
    primary: '#3E7CB1',       // Soft blue - professional, trustworthy
    secondary: '#81A4CD',     // Light blue - complementary softer tone
    tertiary: '#5D9CEC',      // Bright blue - accent for important elements
    background: '#F8FAFC',    // Off-white - clean, professional look
    card: '#FFFFFF',          // Pure white - for content cards
    textPrimary: '#2C3E50',   // Dark slate - primary text
    textSecondary: '#7F8C8D', // Medium gray - secondary text
    border: '#E2E8F0',        // Light gray - subtle borders
    notification: '#E74C3C',  // Soft red - notifications
    success: '#2ECC71',       // Soft green - success messages
    warning: '#F39C12',       // Soft orange - warnings
    info: '#3498DB',          // Medium blue - info messages
    inputBackground: '#F5F7FA', // Light gray - form inputs
    separator: 'rgba(44,62,80,0.05)', // Dark slate with transparency
  }
};

export const darkTheme = {
  colors: {
    primary: '#5D9CEC',       // Brighter blue - stands out in dark mode
    secondary: '#4A6FA5',     // Medium blue - complementary tone
    tertiary: '#2ECC71',      // Light green - accent for important elements
    background: '#1E293B',    // Dark blue-gray - professional dark background
    card: '#2C3E50',          // Dark slate - for content cards
    textPrimary: '#ECF0F1',   // Off-white - primary text
    textSecondary: '#BDC3C7', // Light gray - secondary text
    border: '#3E4C5E',        // Medium blue-gray - subtle borders
    notification: '#E74C3C',  // Soft red - notifications
    success: '#2ECC71',       // Soft green - success messages
    warning: '#F39C12',       // Soft orange - warnings
    info: '#3498DB',          // Medium blue - info messages
    inputBackground: '#283747', // Slightly lighter than background
    separator: 'rgba(236,240,241,0.1)', // Off-white with transparency
  }
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
};

export const getTheme = (isDark: boolean) => (isDark ? darkTheme : lightTheme);