import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkerSuccessScreen() {
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  
  const handleGoHome = () => {
    router.push('/onboarding');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>✅</Text>
          <ThemedText style={styles.title}>Profile Submitted!</ThemedText>
          <ThemedText style={styles.message}>
            Your worker profile has been submitted. Employers can now see your availability and contact you for work opportunities.
          </ThemedText>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={handleGoHome}
          >
            <ThemedText style={styles.buttonText}>Go to Home</ThemedText>
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
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});