import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export const WaitingIllustration = () => {
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const secondaryColor = useThemeColor({ light: '#F43F5E', dark: '#FB7185' }, 'text');
  const tertiaryColor = useThemeColor({ light: '#10B981', dark: '#34D399' }, 'text');
  
  // For animated elements
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Create a repeating pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // Create a continuous spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  // Map the spin value to a rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        {/* Main phone icon */}
        <Animated.View 
          style={[
            styles.phoneCircle, 
            { 
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <View style={styles.phoneIconContainer}>
            <Ionicons name="call" size={40} color={primaryColor} />
          </View>
        </Animated.View>
        
        {/* Rotating orbit */}
        <Animated.View 
          style={[
            styles.orbit,
            {
              borderColor: 'rgba(79, 70, 229, 0.2)',
              transform: [{ rotate: spin }]
            }
          ]}
        >
          <View style={[styles.orbitDot1, { backgroundColor: secondaryColor }]} />
          <View style={[styles.orbitDot2, { backgroundColor: tertiaryColor }]} />
          <View style={[styles.orbitDot3, { backgroundColor: primaryColor }]} />
        </Animated.View>
        
        {/* Decoration elements */}
        <View style={[styles.decorCircle1, { backgroundColor: secondaryColor }]} />
        <View style={[styles.decorCircle2, { backgroundColor: primaryColor }]} />
        <View style={[styles.decorDot1, { backgroundColor: tertiaryColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  illustrationContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  phoneIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  orbitDot1: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 20,
    right: 20,
  },
  orbitDot2: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    bottom: 30,
    left: 40,
  },
  orbitDot3: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    top: 90,
    left: 10,
  },
  decorCircle1: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.3,
    top: 30,
    right: 10,
  },
  decorCircle2: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.2,
    bottom: 20,
    left: 20,
  },
  decorDot1: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    bottom: 50,
    right: 30,
  }
});