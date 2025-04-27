import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch, View, ActivityIndicator, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSkills } from '../../services/hirerService';
import { getWorkerProfile, registerWorker, validateWorkerData } from '../../services/workerService';
import { WorkerRegistrationIllustration } from '@/components/illustrations/WorkerRegistrationIllustration';
import { Ionicons } from '@expo/vector-icons';
import { Worker } from '../../types';
import i18n from '@/app/i18n/i18n';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [available, setAvailable] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  const inputBackground = useThemeColor({ light: '#f5f5f7', dark: '#1e1e1e' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#2a2a2a' }, 'background');
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');

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

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = await getWorkerProfile();
      if (profileData) {
        setProfile(profileData);
        setName(profileData.name);
        setPhone(profileData.phone);
        setLocation(profileData.location);
        setSelectedSkill(profileData.skill);
        setAvailable(profileData.available);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    // Load the profile data when the component mounts
    loadProfile();
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
        <View style={styles.header}>
          <WorkerRegistrationIllustration />
          <ThemedText style={styles.title}>{i18n.t('editProfile.title')}</ThemedText>
          <ThemedText style={styles.subtitle}>{i18n.t('editProfile.subtitle')}</ThemedText>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="person-outline" size={18} color={primaryColor} style={styles.labelIcon} />
              <ThemedText style={styles.label}>{i18n.t('editProfile.fullName')}</ThemedText>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackground }]}
              value={name}
              onChangeText={setName}
              placeholder={i18n.t('editProfile.fullNamePlaceholder')}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="call-outline" size={18} color={primaryColor} style={styles.labelIcon} />
              <ThemedText style={styles.label}>{i18n.t('editProfile.phoneNumber')}</ThemedText>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackground }]}
              value={phone}
              onChangeText={setPhone}
              placeholder={i18n.t('editProfile.phoneNumberPlaceholder')}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="location-outline" size={18} color={primaryColor} style={styles.labelIcon} />
              <ThemedText style={styles.label}>{i18n.t('editProfile.location')}</ThemedText>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackground }]}
              value={location}
              onChangeText={setLocation}
              placeholder={i18n.t('editProfile.locationPlaceholder')}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="construct-outline" size={18} color={primaryColor} style={styles.labelIcon} />
              <ThemedText style={styles.label}>{i18n.t('editProfile.selectSkill')}</ThemedText>
            </View>
            {isLoading ? (
              <View style={styles.skillsLoading}>
                <ActivityIndicator size="small" color={primaryColor} />
                <ThemedText style={styles.loadingText}>{i18n.t('editProfile.loadingSkills')}</ThemedText>
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
                        borderColor: 'rgba(0,0,0,0.05)'
                      }
                    ]}
                    onPress={() => setSelectedSkill(skill)}
                  >
                    <ThemedText
                      style={[
                        styles.skillText,
                        { color: skill === selectedSkill ? '#fff' : undefined }
                      ]}
                    >
                      {skill}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityLeft}>
              <Ionicons name="time-outline" size={18} color={primaryColor} style={styles.labelIcon} />
              <ThemedText style={styles.label}>{i18n.t('editProfile.availableToday')}</ThemedText>
            </View>
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
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <ThemedText style={styles.submitText}>{i18n.t('editProfile.submitProfile')}</ThemedText>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.submitIcon} />
            </>
          )}
        </TouchableOpacity>

        <ThemedText style={styles.policyNote}>
          {i18n.t('editProfile.privacyPolicy')}
        </ThemedText>
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
    marginBottom: 12,
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
  skillsLoading: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});