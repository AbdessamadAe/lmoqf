import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/app/theme/useTheme';

export const OnboardingIllustration = () => {
  const theme = useTheme();
  const primaryColor = theme.colors.primary;
  const secondaryColor = theme.colors.secondary;
  const tertiaryColor = theme.colors.tertiary;
  const backgroundColor = theme.colors.background;
  
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <View style={[styles.circle, { backgroundColor: primaryColor }]} />
        <View style={[styles.square, { backgroundColor: secondaryColor }]} />
        <View style={[styles.triangle, { borderBottomColor: tertiaryColor }]} />
        <View style={[styles.connectingLine, { backgroundColor: backgroundColor }]} />
        <View style={[styles.dot1, { backgroundColor: secondaryColor }]} />
        <View style={[styles.dot2, { backgroundColor: primaryColor }]} />
        <View style={[styles.dot3, { backgroundColor: tertiaryColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  illustrationContainer: {
    width: 250,
    height: 200,
    position: 'relative',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    top: 20,
    left: 20,
    opacity: 0.9,
  },
  square: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 30,
    left: 40,
    opacity: 0.9,
    transform: [{ rotate: '15deg' }],
  },
  triangle: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: 50,
    right: 30,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 70,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.9,
  },
  connectingLine: {
    width: 150,
    height: 3,
    position: 'absolute',
    top: 100,
    left: 50,
    opacity: 0.6,
  },
  dot1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 140,
    left: 80,
  },
  dot2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 30,
    left: 150,
  },
  dot3: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 50,
    right: 40,
  },
});