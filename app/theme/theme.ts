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
    primary: '#8B5A2B',       // Saddle Brown - rich walnut
    secondary: '#A67C52',     // Camel - medium oak tone
    tertiary: '#D2B48C',      // Tan - light maple
    background: '#FFF8E1',    // Light cream - birch wood
    card: '#F5E9D0',          // Eggshell - light ash wood
    textPrimary: '#3E2723',   // Dark Brown - ebony wood
    textSecondary: '#6D4C41', // Brown - rosewood
    border: '#D7CCC8',        // Light taupe - weathered wood
    notification: '#B71C1C',  // Dark red - redwood
    success: '#33691E',       // Forest green - complementary to wood
    warning: '#E65100',       // Burnt orange - cherry wood
    info: '#8B5A2B',          // Saddle Brown - matches primary
    inputBackground: '#F5E9D0', // Eggshell - light ash wood
    separator: 'rgba(62,39,35,0.05)', // Dark Brown with transparency
  }
};

export const darkTheme = {
  colors: {
    primary: '#9C6F44',       // Golden oak - warmer for dark theme
    secondary: '#7D5A4D',     // Hickory - medium-dark wood
    tertiary: '#B78D5A',      // Golden amber - cedar wood
    background: '#362A21',    // Dark umber - ebony/dark walnut
    card: '#483C32',          // Taupe - dark oak
    textPrimary: '#E6D7B8',   // Cream - bleached wood
    textSecondary: '#C8B49D', // Khaki - aged pine
    border: '#5D4037',        // Dark brown - mahogany
    notification: '#C62828',  // Red - redwood with contrast for dark theme
    success: '#558B2F',       // Olive - moss on wood
    warning: '#FF8F00',       // Amber - pine resin
    info: '#9C6F44',          // Golden oak - matches primary
    inputBackground: '#483C32', // Taupe - dark oak
    separator: 'rgba(230,215,184,0.1)', // Cream with transparency
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