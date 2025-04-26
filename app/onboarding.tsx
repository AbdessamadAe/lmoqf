import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingIllustration } from '@/components/illustrations/OnboardingIllustration';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from '@/components/LanguageSelector';
import i18n from '@/app/i18n/i18n';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useUserRole } from './context/UserRoleContext';

export type UserRole = 'worker' | 'hirer';

export default function OnboardingScreen() {
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const tintColor = useThemeColor({ light: '#4F46E5', dark: '#6366F1' }, 'text');
  const cardBackground = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  const { isRTL } = useLanguage();
  const { setUserRole } = useUserRole();
  
  const handleRoleSelect = async (role: UserRole) => {
    try {
      // Set the user role in the context
      await setUserRole(role);
      
      // If worker, navigate to registration page; if hirer, go to hirer tabs
      if (role === 'worker') {
        router.replace('/worker-registration');
      } else {
        router.replace('/(hirer-tabs)');
      }
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  };
  
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{i18n.t('onboarding.title')}</ThemedText>
          <ThemedText style={styles.subtitle}>{i18n.t('onboarding.subtitle')}</ThemedText>
        </View>
        
        <OnboardingIllustration />
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: cardBackground }]}
            onPress={() => handleRoleSelect('worker')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(79, 70, 229, 0.1)' }]}>
              <Ionicons name="construct-outline" size={28} color={tintColor} />
            </View>
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionText}>{i18n.t('onboarding.workerButton')}</ThemedText>
              <ThemedText style={styles.optionDescription}>{i18n.t('onboarding.workerDescription')}</ThemedText>
            </View>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={20} 
              color={tintColor} 
              style={styles.arrowIcon} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: cardBackground }]}
            onPress={() => handleRoleSelect('hirer')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 113, 133, 0.1)' }]}>
              <Ionicons name="briefcase-outline" size={28} color="#F43F5E" />
            </View>
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionText}>{i18n.t('onboarding.hirerButton')}</ThemedText>
              <ThemedText style={styles.optionDescription}>{i18n.t('onboarding.hirerDescription')}</ThemedText>
            </View>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={20} 
              color={tintColor} 
              style={styles.arrowIcon} 
            />
          </TouchableOpacity>
        </View>
        
        <LanguageSelector style={styles.languageSelector} />
        
        <ThemedText style={styles.footer}>{i18n.t('onboarding.footer')}</ThemedText>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  languageSelector: {
    marginVertical: 20,
  },
});