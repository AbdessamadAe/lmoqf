import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/app/theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: keyof typeof paddingSizes | number;
}

const paddingSizes = {
  none: 0,
  small: 12,
  medium: 16,
  large: 24,
};

export function Card({
  children,
  style,
  variant = 'elevated',
  padding = 'medium',
}: CardProps) {
  const theme = useTheme();
  
  const cardStyles = [
    styles.card,
    { 
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: typeof padding === 'string' 
        ? paddingSizes[padding] 
        : padding,
    }
  ];
  
  // Apply variant styles
  switch (variant) {
    case 'elevated':
      cardStyles.push(theme.shadow.md);
      break;
    case 'outlined':
      cardStyles.push({
        borderWidth: 1,
        borderColor: theme.colors.border,
      });
      break;
    // 'flat' has no additional styling
  }
  
  return (
    <View style={[cardStyles, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});