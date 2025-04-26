import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SuccessIllustration } from '@/components/illustrations/SuccessIllustration';
import { Ionicons } from '@expo/vector-icons';

export default function WorkerSuccessScreen() {
  const primaryColor = useThemeColor({ light: '#10B981', dark: '#34D399' }, 'tint');
  const secondaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'text');
  const cardBackground = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  
  const handleGoHome = () => {
    router.push('/onboarding');
  };
  
  const handleViewProfile = () => {
    // This would navigate to a profile view screen in a real app
    router.push('/onboarding');
  };
  
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <SuccessIllustration />
          
          <ThemedText style={styles.title}>Profile Submitted!</ThemedText>
          <ThemedText style={styles.message}>
            Your worker profile has been successfully created. Employers can now discover you and reach out for work opportunities.
          </ThemedText>
          
          <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
            <View style={styles.infoRow}>
              <Ionicons name="eye-outline" size={20} color={secondaryColor} style={styles.infoIcon} />
              <ThemedText style={styles.infoText}>Your profile is now visible to employers</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="notifications-outline" size={20} color={secondaryColor} style={styles.infoIcon} />
              <ThemedText style={styles.infoText}>You'll be notified when someone wants to hire you</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="create-outline" size={20} color={secondaryColor} style={styles.infoIcon} />
              <ThemedText style={styles.infoText}>You can edit your profile anytime</ThemedText>
            </View>
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: primaryColor }]}
              onPress={handleViewProfile}
            >
              <ThemedText style={styles.primaryButtonText}>View Profile</ThemedText>
              <Ionicons name="person-outline" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: secondaryColor }]}
              onPress={handleGoHome}
            >
              <ThemedText style={[styles.secondaryButtonText, { color: secondaryColor }]}>
                Go to Home
              </ThemedText>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 500, // For supporting tablet layouts
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
    marginBottom: 32,
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    flex: 1,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});