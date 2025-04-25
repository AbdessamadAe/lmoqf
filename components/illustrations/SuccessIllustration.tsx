import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export const SuccessIllustration = () => {
  const primaryColor = useThemeColor({ light: '#10B981', dark: '#34D399' }, 'tint');
  const secondaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'text');
  const backgroundColor = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'background');
  
  // For animated checkmark
  const checkmarkScale = new Animated.Value(0);
  const rotateAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1.2,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(2),
        useNativeDriver: true
      })
    ]).start();
    
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.bounce,
      useNativeDriver: true
    }).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.outerCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
        <View style={[styles.innerCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
          <Animated.View 
            style={[
              styles.checkmarkContainer, 
              { 
                backgroundColor: primaryColor,
                transform: [
                  { scale: checkmarkScale },
                  { rotate }
                ] 
              }
            ]}
          >
            <Ionicons name="checkmark" size={40} color="#fff" />
          </Animated.View>
        </View>
      </View>
      
      {/* Decorative elements */}
      <View style={[styles.decorCircle1, { backgroundColor: secondaryColor }]} />
      <View style={[styles.decorCircle2, { backgroundColor: primaryColor }]} />
      <View style={[styles.decorCircle3, { backgroundColor: 'rgba(16, 185, 129, 0.3)' }]} />
      <View style={[styles.decorCircle4, { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  outerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorCircle1: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 30,
    right: 90,
    opacity: 0.6,
  },
  decorCircle2: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    bottom: 50,
    right: 100,
    opacity: 0.5,
  },
  decorCircle3: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 80,
    left: 80,
  },
  decorCircle4: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    bottom: 40,
    left: 90,
  }
});