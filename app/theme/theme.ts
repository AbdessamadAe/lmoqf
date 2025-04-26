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
    primary: '#2563eb',       // Blue
    secondary: '#F43F5E',     // Pink
    tertiary: '#10B981',      // Green
    background: '#FFFFFF',
    card: '#F9FAFB',
    textPrimary: '#111827',
    textSecondary: '#6B7280', 
    border: '#E5E7EB',
    notification: '#EF4444',  // Red for notifications/errors
    success: '#10B981',       // Green for success states
    warning: '#F59E0B',       // Amber for warnings
    info: '#3B82F6',          // Blue for information
    inputBackground: '#F3F4F6',
    separator: 'rgba(0,0,0,0.05)',
  }
};

export const darkTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#FB7185',
    tertiary: '#34D399',
    background: '#111827',
    card: '#1F2937',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    notification: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#60A5FA',
    inputBackground: '#1F2937',
    separator: 'rgba(255,255,255,0.1)',
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