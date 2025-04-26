import { useColorScheme } from 'react-native';
import { getTheme, lightTheme, darkTheme, spacing, borderRadius, fontSizes, fontWeights, shadow } from './theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);
  
  return {
    colors: theme.colors,
    spacing,
    borderRadius,
    fontSizes,
    fontWeights,
    shadow,
    isDark
  };
}

// Type for theme colors
export type ThemeColors = typeof lightTheme.colors;