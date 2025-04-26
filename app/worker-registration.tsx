import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch, View, ActivityIndicator } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSkills } from './services/dataService';
import { registerWorker, validateWorkerData, WorkerProfile } from './services/workerService';
import { WorkerRegistrationIllustration } from '@/components/illustrations/WorkerRegistrationIllustration';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkerRegistrationScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [available, setAvailable] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleSubmit = async () => {
    const workerData: WorkerProfile = {
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
        // Ensure profile is fully saved in AsyncStorage before navigating
        try {
          // Double-check AsyncStorage has the profile data
          const profileJson = JSON.stringify(result.profile);
          await AsyncStorage.setItem('@lmoqf:worker_profile', profileJson);
          
          console.log('Profile saved to AsyncStorage before navigation');
          
          // Redirect based on availability status
          if (available) {
            // If available, send to waiting screen
            router.replace({
              pathname: '/worker-waiting',
              params: { directFromRegistration: 'true' }
            });
          } else {
            // If not available today, navigate to profile screen
            router.replace({
              pathname: '/(worker-tabs)/profile',
              params: { directFromRegistration: 'true' }
            });
          }
        } catch (storageError) {
          console.error('Error saving profile to AsyncStorage:', storageError);
          // Still attempt to navigate even if storage failed
          router.replace(available ? '/worker-waiting' : '/(worker-tabs)/profile');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          
          <View style={styles.header}>
            <WorkerRegistrationIllustration />
            <ThemedText style={styles.title}>Create Your Worker Profile</ThemedText>
            <ThemedText style={styles.subtitle}>Complete your details to be discoverable by employers</ThemedText>
          </View>
          
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={18} color={primaryColor} style={styles.labelIcon} />
                <ThemedText style={styles.label}>Full Name</ThemedText>
              </View>
              <TextInput 
                style={[styles.input, { backgroundColor: inputBackground }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="call-outline" size={18} color={primaryColor} style={styles.labelIcon} />
                <ThemedText style={styles.label}>Phone Number</ThemedText>
              </View>
              <TextInput 
                style={[styles.input, { backgroundColor: inputBackground }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="location-outline" size={18} color={primaryColor} style={styles.labelIcon} />
                <ThemedText style={styles.label}>Location/City</ThemedText>
              </View>
              <TextInput 
                style={[styles.input, { backgroundColor: inputBackground }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Where you're available to work"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="construct-outline" size={18} color={primaryColor} style={styles.labelIcon} />
                <ThemedText style={styles.label}>Select Your Main Skill</ThemedText>
              </View>
              {isLoading ? (
                <View style={styles.skillsLoading}>
                  <ActivityIndicator size="small" color={primaryColor} />
                  <ThemedText style={styles.loadingText}>Loading available skills...</ThemedText>
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
                <ThemedText style={styles.label}>Available Today?</ThemedText>
              </View>
              <Switch
                value={available}
                onValueChange={setAvailable}
                ios_backgroundColor="#ccc"
                trackColor={{ false: '#767577', true: primaryColor }}
                thumbColor="#f4f3f4"
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
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <ThemedText style={styles.submitText}>Submit Profile</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.submitIcon} />
              </>
            )}
          </TouchableOpacity>
          
          <ThemedText style={styles.policyNote}>
            By submitting, you agree to our terms and privacy policy
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
    zIndex: 1,
  },
});