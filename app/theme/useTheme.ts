import { useColorScheme } from 'react-native';
import { getTheme, lightTheme, darkTheme, spacing, borderRadius, fontSizes, fontWeights, shadow } from './theme';
import { useLanguage } from '../i18n/LanguageContext';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isRTL } = useLanguage();
  
  const theme = getTheme(isDark);
  
  return {
    isDark,
    ...theme,
    spacing,
    borderRadius,
    fontSizes,
    fontWeights,
    shadow,
    textAlign: isRTL ? 'right' : 'left',
    direction: isRTL ? 'rtl' : 'ltr'
  };
}

// Type for theme colors
export type ThemeColors = typeof lightTheme.colors;