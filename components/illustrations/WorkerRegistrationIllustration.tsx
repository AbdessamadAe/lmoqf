import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export const WorkerRegistrationIllustration = () => {
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const secondaryColor = useThemeColor({ light: '#F43F5E', dark: '#FB7185' }, 'text');
  const backgroundColor = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'background');
  
  return (
    <View style={styles.container}>
      <View style={styles.circleBackground}>
        <View style={[styles.innerCircle, { backgroundColor: backgroundColor }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add-outline" size={40} color={primaryColor} />
          </View>
        </View>
      </View>
      <View style={[styles.decoratorCircle1, { backgroundColor: secondaryColor }]} />
      <View style={[styles.decoratorCircle2, { backgroundColor: primaryColor }]} />
      <View style={[styles.decoratorDot1, { backgroundColor: secondaryColor }]} />
      <View style={[styles.decoratorDot2, { backgroundColor: primaryColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decoratorCircle1: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 10,
    right: 80,
    opacity: 0.5,
  },
  decoratorCircle2: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    bottom: 20,
    left: 90,
    opacity: 0.3,
  },
  decoratorDot1: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 40,
    left: 100,
  },
  decoratorDot2: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    bottom: 30,
    right: 90,
  },
});