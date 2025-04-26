import React from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  required?: boolean;
}

export function InputField({
  label,
  error,
  iconName,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  required = false,
  ...restProps
}: InputFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          {iconName && (
            <Ionicons 
              name={iconName as any} 
              size={18} 
              color={theme.colors.primary} 
              style={styles.labelIcon} 
            />
          )}
          <ThemedText 
            style={[
              styles.label, 
              { 
                color: error ? theme.colors.notification : theme.colors.textPrimary,
                marginBottom: theme.spacing.xs,
                fontSize: theme.fontSizes.md,
                fontWeight: theme.fontWeights.medium
              }, 
              labelStyle
            ]}
          >
            {label} {required && <ThemedText style={{ color: theme.colors.notification }}>*</ThemedText>}
          </ThemedText>
        </View>
      )}
      
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.textPrimary,
            borderColor: error ? theme.colors.notification : 'transparent',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSizes.md,
            padding: theme.spacing.md,
          },
          inputStyle
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...restProps}
      />
      
      {error && (
        <ThemedText 
          style={[
            styles.error, 
            { 
              color: theme.colors.notification,
              fontSize: theme.fontSizes.xs, 
              marginTop: theme.spacing.xs 
            }, 
            errorStyle
          ]}
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    width: '100%',
  },
  error: {
    marginTop: 4,
  },
});