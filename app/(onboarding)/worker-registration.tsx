import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch, View, ActivityIndicator, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/app/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSkills } from '../services/hirerService';
import { registerWorker, validateWorkerData } from '../services/workerService';
import { Ionicons } from '@expo/vector-icons';
import { Worker } from '../types';
import i18n from '@/app/i18n/i18n';
import { useUserRole } from '../context/UserRoleContext';
import { locations } from '@/constants/locations';
import { Dropdown } from '../components/Dropdown';

export default function WorkerRegistrationScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [available, setAvailable] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const { setUserRole } = useUserRole();
  
  const theme = useTheme();
  const inputBackground = theme.colors.inputBackground;
  const primaryColor = theme.colors.primary;

  // Ensure header is properly configured
  useEffect(() => {
    // We'll let the layout file handle the header configuration
    // This ensures the back button will show properly
  }, []);

  // Load skills from our data service
  useEffect(() => {
    const loadSkills = async () => {
      setIsLoading(true);
      try {
        const skillsData = await fetchSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handleSubmit = async () => {
    const workerData: Worker = {
      name,
      phone,
      location,
      skill: selectedSkill,
      available
    };

    // Validate worker data
    const validation = validateWorkerData(workerData);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerWorker(workerData);
      if (result.success && result.profile) {
        await setUserRole('worker');
        // Redirect based on availability status
        if (available) {
          // If available, send to waiting screen
          router.replace({
            pathname: '/(worker-tabs)',
            params: { directFromRegistration: 'true' }
          });
        } else {
          // If not available today, navigate to profile screen
          router.replace({
            pathname: '/(worker-tabs)/profile',
            params: { directFromRegistration: 'true' }
          });
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert(i18n.t('editProfile.registrationError'));
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
              <ThemedText style={styles.title}>{i18n.t('workerRegistration.title')}</ThemedText>
              <ThemedText style={styles.subtitle}>{i18n.t('workerRegistration.subtitle')}</ThemedText>
            </View>

            <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                <View style={[styles.labelContainer, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="person" size={16} color={primaryColor} style={[styles.labelIcon, { marginRight: theme.direction === 'rtl' ? 0 : 6, marginLeft: theme.direction === 'rtl' ? 6 : 0 }]} />
                  <ThemedText style={styles.label}>{i18n.t('workerRegistration.fullName')}</ThemedText>
                </View>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBackground, textAlign: theme.textAlign }]}
                  value={name}
                  onChangeText={setName}
                  placeholder={i18n.t('workerRegistration.fullNamePlaceholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                />
                </View>

              <View style={styles.inputContainer}>
                <View style={[styles.labelContainer, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="call" size={16} color={primaryColor} style={[styles.labelIcon, { marginRight: theme.direction === 'rtl' ? 0 : 6, marginLeft: theme.direction === 'rtl' ? 6 : 0 }]} />
                  <ThemedText style={styles.label}>{i18n.t('workerRegistration.phoneNumber')}</ThemedText>
                </View>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBackground, textAlign: theme.textAlign }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder={i18n.t('workerRegistration.phoneNumberPlaceholder')}
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.labelContainer, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="location" size={16} color={primaryColor} style={[styles.labelIcon, { marginRight: theme.direction === 'rtl' ? 0 : 6, marginLeft: theme.direction === 'rtl' ? 6 : 0 }]} />
                  <ThemedText style={styles.label}>{i18n.t('workerRegistration.location')}</ThemedText>
                </View>
                <View style={[styles.dropdownWrapper, { backgroundColor: inputBackground }]}>
                  <Dropdown
                    placeholder={i18n.t('workerRegistration.locationPlaceholder')}
                    items={locations}
                    value={location ? i18n.t('locations.' + location) : ''}
                    onValueChange={setLocation}
                    textAlign={theme.textAlign}
                    dropdownStyle={styles.dropdownStyle}
                    label="location"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.labelContainer, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="construct" size={16} color={primaryColor} style={[styles.labelIcon, { marginRight: theme.direction === 'rtl' ? 0 : 6, marginLeft: theme.direction === 'rtl' ? 6 : 0 }]} />
                  <ThemedText style={styles.label}>{i18n.t('workerRegistration.selectSkill')}</ThemedText>
                </View>
                {isLoading ? (
                  <View style={styles.skillsLoading}>
                    <ActivityIndicator size="small" color={primaryColor} />
                    <ThemedText style={styles.loadingText}>{i18n.t('workerRegistration.loadingSkills')}</ThemedText>
                  </View>
                ) : (
                  <View style={styles.skillsGrid}>
                    {skills.map(skill => (
                      <TouchableOpacity
                        key={skill}
                        style={[
                          styles.skillButton,
                          {
                            backgroundColor: skill === selectedSkill ? primaryColor : inputBackground,
                            borderWidth: skill === selectedSkill ? 0 : 1,
                            borderColor: theme.colors.border
                          }
                        ]}
                        onPress={() => setSelectedSkill(skill)}
                      >
                        <ThemedText
                          style={[
                            styles.skillText,
                            { color: skill === selectedSkill ? theme.colors.background : undefined }
                          ]}
                        >
                          {i18n.t(`skills.${skill}`)}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={[styles.availabilityContainer, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                <View style={[styles.availabilityLeft, { flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="time" size={16} color={primaryColor} style={[styles.labelIcon, { marginRight: theme.direction === 'rtl' ? 0 : 6, marginLeft: theme.direction === 'rtl' ? 6 : 0 }]} />
                  <ThemedText style={styles.label}>{i18n.t('workerRegistration.availableToday')}</ThemedText>
                </View>
                <Switch
                  value={available}
                  onValueChange={setAvailable}
                  ios_backgroundColor={theme.colors.border}
                  trackColor={{ false: theme.colors.border, true: primaryColor }}
                  thumbColor={theme.colors.background}
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
                    {i18n.t('workerRegistration.submitProfile')}
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

            <ThemedText style={styles.policyNote}>
              {i18n.t('workerRegistration.privacyPolicy')}
            </ThemedText>
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
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  dropdownWrapper: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  availabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#fff',
  },
  submitIcon: {
    marginLeft: 8,
  },
  policyNote: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.5,
    marginTop: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownStyle: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
});