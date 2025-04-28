import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingIllustration } from '@/components/illustrations/OnboardingIllustration';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveHirerLocation } from '../services/hirerService';
import i18n from '../i18n/i18n';
import { useUserRole } from '../context/UserRoleContext';

export default function HirerLocationScreen() {
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const { setUserRole } = useUserRole();

  const theme = useTheme();
  const inputBackground = theme.colors.inputBackground;
  const primaryColor = theme.colors.secondary; // Using secondary color for hirer screens

  // Ensure header is properly configured
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: i18n.t('setHirerLocation.headerTitle'),
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTitleStyle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
      },
      headerShadowVisible: false,
    });
  }, [navigation, theme]);


  const handleSubmit = async () => {
    if (!location.trim()) {
      Alert.alert('Location Required', 'Please enter or select your location');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveHirerLocation(location.trim());
      await setUserRole('hirer');
      // Navigate to the hirer tabs
      router.replace('/(hirer-tabs)');
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save your location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <OnboardingIllustration />
            <ThemedText style={styles.title}>{i18n.t('setHirerLocation.title')}</ThemedText>
            <ThemedText style={styles.subtitle}>{i18n.t('setHirerLocation.subtitle')}</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
              <Ionicons name="location-outline" size={18} color={primaryColor} style={styles.labelIcon} />
              <ThemedText style={styles.label}>{i18n.t('setHirerLocation.location')}</ThemedText>
              </View>
              <TextInput
              style={[styles.input, { backgroundColor: inputBackground, textAlign: 'center' }]}
              value={location}
              onChangeText={setLocation}
              placeholder={`${i18n.t('setHirerLocation.locationPlaceholder')}`}
              placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: primaryColor },
              isSubmitting && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <>
                <ThemedText style={[styles.submitText, { color: theme.colors.background }]}>{i18n.t('setHirerLocation.continue')}</ThemedText>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.background} style={styles.submitIcon} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  suggestedTitle: {
    marginBottom: 12,
    fontSize: 14,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  locationButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitIcon: {
    marginLeft: 8,
  },
  skipText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 16,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});