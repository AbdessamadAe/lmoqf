import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const buttonBackground = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  
  const handleWorkerSelect = () => {
    router.push('/worker-registration');
  };
  
  const handleHirerSelect = () => {
    router.push('/available-workers');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Lmoqf</ThemedText>
          <ThemedText style={styles.subtitle}>Connect workers and employers</ThemedText>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: buttonBackground }]}
            onPress={handleWorkerSelect}
          >
            <Text style={[styles.optionEmoji]}>👷‍♂️</Text>
            <ThemedText style={styles.optionText}>I'm a Worker</ThemedText>
            <ThemedText style={styles.optionDescription}>Find work opportunities</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: buttonBackground }]}
            onPress={handleHirerSelect}
          >
            <Text style={[styles.optionEmoji]}>🧑‍💼</Text>
            <ThemedText style={styles.optionText}>I'm Hiring</ThemedText>
            <ThemedText style={styles.optionDescription}>Find available workers</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
  },
  optionButton: {
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 16,
    opacity: 0.7,
  },
});