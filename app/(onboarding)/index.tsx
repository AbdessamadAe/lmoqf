import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from '@/components/LanguageSelector';
import i18n from '@/app/i18n/i18n';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import { Platform } from 'react-native';

export type UserRole = 'worker' | 'hirer';

export default function OnboardingScreen() {
  const theme = useTheme();
  const { isRTL } = useLanguage();
  // get platform android or ios
  const platform = Platform.OS; // 'ios' or 'android'
  
  const handleRoleSelect = async (role: UserRole) => {
    try {      
      // If worker, navigate to registration page
      if (role === 'worker') {
        router.push('/(onboarding)/worker-registration');
      } 
      // If hirer, navigate to the location selection screen
      else {
        router.push('/(onboarding)/hirer-location');
      }
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  };
  
  return (
    <SafeAreaView edges={['left', 'right', 'top', 'bottom']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{i18n.t('onboarding.title')}</ThemedText>
          <ThemedText style={styles.subtitle}>{i18n.t('onboarding.subtitle')}</ThemedText>
        </View>
        
        <View style={styles.illustrationContainer}>
          <Image
            source={require('@/assets/images/splash-icon.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: theme.colors.card }]}
            onPress={() => handleRoleSelect('worker')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Ionicons name="construct-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionText}>{i18n.t('onboarding.workerButton')}</ThemedText>
              <ThemedText style={styles.optionDescription}>{i18n.t('onboarding.workerDescription')}</ThemedText>
            </View>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={18} 
              color={theme.colors.primary} 
              style={styles.arrowIcon} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: theme.colors.card }]}
            onPress={() => handleRoleSelect('hirer')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.secondary}15` }]}>
              <Ionicons name="briefcase-outline" size={24} color={theme.colors.secondary} />
            </View>
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionText}>{i18n.t('onboarding.hirerButton')}</ThemedText>
              <ThemedText style={styles.optionDescription}>{i18n.t('onboarding.hirerDescription')}</ThemedText>
            </View>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={18} 
              color={theme.colors.primary} 
              style={styles.arrowIcon} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[
          styles.footer, 
          platform === 'android' && { marginBottom: 18 }
        ]}>
          <LanguageSelector style={styles.languageSelector} />
          <ThemedText style={styles.footerText}>{i18n.t('onboarding.footer')}</ThemedText>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 22,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  illustrationImage: {
    height: 200,
    maxWidth: 200,
  },
  optionsContainer: {
    gap: 14,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  optionDescription: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
  },
  arrowIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8, // Add padding to ensure content doesn't touch the navigation bar
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.5,
    marginBottom: 8, // Add some margin at the bottom
  },
  languageSelector: {
    marginVertical: 8
  },
});