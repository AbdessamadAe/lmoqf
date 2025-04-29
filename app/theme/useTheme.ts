import { useColorScheme } from 'react-native';
import { getTheme, lightTheme, darkTheme, spacing, borderRadius, fontSizes, fontWeights, shadow } from './theme';
import { useLanguage } from '../i18n/LanguageContext';
import { useEffect, useState } from 'react';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isRTL, locale } = useLanguage();
  
  // Track text alignment and direction with state to ensure updates
  const [textAlign, setTextAlign] = useState<'left' | 'right'>(isRTL ? 'right' : 'left');
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(isRTL ? 'rtl' : 'ltr');
  
  // Update direction and alignment when language changes
  useEffect(() => {
    setTextAlign(isRTL ? 'right' : 'left');
    setDirection(isRTL ? 'rtl' : 'ltr');
  }, [isRTL, locale]);
  
  const theme = getTheme(isDark);
  
  return {
    isDark,
    ...theme,
    spacing,
    borderRadius,
    fontSizes,
    fontWeights,
    shadow,
    textAlign,
    direction
  };
}

// Type for theme colors
export type ThemeColors = typeof lightTheme.colors;