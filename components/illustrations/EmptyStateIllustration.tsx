import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/app/theme/useTheme';
import { Ionicons } from '@expo/vector-icons';

export const EmptyStateIllustration = () => {
  const theme = useTheme();
  const primaryColor = theme.colors.primary;
  const secondaryColor = theme.colors.secondary;
  const backgroundColor = theme.colors.background;
  
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: `${primaryColor}1A` }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="search-outline" size={40} color={primaryColor} />
        </View>
      </View>
      <View style={styles.decorationContainer}>
        <View style={[styles.dot1, { backgroundColor: secondaryColor }]} />
        <View style={[styles.dot2, { backgroundColor: primaryColor }]} />
        <View style={[styles.squiggle, { borderColor: primaryColor }]} />
        <View style={[styles.shortLine, { backgroundColor: secondaryColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dot1: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 30,
    right: 80,
  },
  dot2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    bottom: 40,
    left: 80,
  },
  squiggle: {
    position: 'absolute',
    width: 30,
    height: 15,
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: 'solid',
    top: 50,
    right: 100,
    transform: [{ rotate: '30deg' }]
  },
  shortLine: {
    position: 'absolute',
    width: 20,
    height: 3,
    bottom: 60,
    left: 70,
    transform: [{ rotate: '-30deg' }]
  }
});