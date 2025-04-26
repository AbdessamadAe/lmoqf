import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  View, 
  StyleProp, 
  ViewStyle,
  TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  haptic?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = true,
  loading = false,
  disabled = false,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const theme = useTheme();
  
  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };
  
  const getButtonStyles = (): StyleProp<ViewStyle> => {
    // Base styles
    let buttonStyle: StyleProp<ViewStyle> = [
      styles.button,
      { borderRadius: theme.borderRadius.md }
    ];
    
    // Size styles
    const sizeStyles = {
      sm: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
      md: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
      lg: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl },
    };
    buttonStyle.push(sizeStyles[size]);
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle.push({ backgroundColor: theme.colors.primary });
        break;
      case 'secondary':
        buttonStyle.push({ backgroundColor: theme.colors.secondary });
        break;
      case 'outline':
        buttonStyle.push({ 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary 
        });
        break;
      case 'ghost':
        buttonStyle.push({ 
          backgroundColor: 'transparent'
        });
        break;
      case 'danger':
        buttonStyle.push({ 
          backgroundColor: theme.colors.notification
        });
        break;
    }
    
    // Width style
    if (fullWidth) {
      buttonStyle.push(styles.fullWidth);
    }
    
    // Disabled style
    if (disabled || loading) {
      buttonStyle.push(styles.disabled, { 
        opacity: 0.6,
      });
    }
    
    return buttonStyle;
  };
  
  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };
  
  const getFontSize = (): number => {
    switch (size) {
      case 'sm': return theme.fontSizes.sm;
      case 'lg': return theme.fontSizes.lg;
      default: return theme.fontSizes.md;
    }
  };
  
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    
    return (
      <Ionicons 
        name={icon as any} 
        size={iconSize} 
        color={getTextColor()} 
        style={
          iconPosition === 'right' 
            ? { marginLeft: theme.spacing.sm }
            : { marginRight: theme.spacing.sm }
        } 
      />
    );
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && renderIcon()}
          <ThemedText 
            style={[
              { 
                color: getTextColor(), 
                fontSize: getFontSize(),
                fontWeight: theme.fontWeights.semiBold
              },
              textStyle
            ]}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    cursor: 'not-allowed',
  },
});