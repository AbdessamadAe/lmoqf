import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { saveHirerLocation } from '../services/hirerService';
import i18n from '../i18n/i18n';
import { useUserRole } from '../context/UserRoleContext';
import { Dropdown } from '../components/Dropdown';
import { locations } from '@/constants/locations';

export default function HirerLocationScreen() {
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const { setUserRole } = useUserRole();

  const theme = useTheme();
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
        fontSize: 20,
        fontWeight: '600',
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
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <ThemedText style={[styles.title, { textAlign: theme.textAlign }]}>
                {i18n.t('setHirerLocation.title')}
              </ThemedText>
              <ThemedText style={[styles.subtitle, { textAlign: theme.textAlign }]}>
                {i18n.t('setHirerLocation.subtitle')}
              </ThemedText>
            </View>

            <View style={[styles.formSection]}>
              <View style={[styles.labelContainer, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                <Ionicons 
                  name="location" 
                  size={16} 
                  color={primaryColor} 
                  style={[styles.labelIcon, { marginRight: theme.direction === 'rtl' ? 0 : 6, marginLeft: theme.direction === 'rtl' ? 6 : 0 }]} 
                />
                <ThemedText style={styles.label}>{i18n.t('setHirerLocation.location')}</ThemedText>
              </View>
              
              <View style={[styles.dropdownWrapper]}>
                <Dropdown
                  placeholder={i18n.t('setHirerLocation.locationPlaceholder')}
                  items={locations}
                  value={location ? i18n.t('locations.' + location) : ''}
                  onValueChange={setLocation}
                  textAlign={theme.textAlign}
                  dropdownStyle={styles.dropdownStyle}
                  label='location'
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
                  <ThemedText style={[styles.submitText, { color: theme.colors.background }]}>
                    {i18n.t('setHirerLocation.continue')}
                  </ThemedText>
                  <Ionicons 
                    name={theme.direction === 'rtl' ? "arrow-back" : "arrow-forward"} 
                    size={18} 
                    color={theme.colors.background} 
                    style={styles.submitIcon} 
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 36,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 36,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  dropdownStyle: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitIcon: {
    marginLeft: 8,
  },
});