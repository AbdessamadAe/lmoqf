import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { fetchSkills } from './services/dataService';
import { registerWorker, validateWorkerData, WorkerProfile } from './services/workerService';

export default function WorkerRegistrationScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [available, setAvailable] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputBackground = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
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
      const success = await registerWorker(workerData);
      if (success) {
        router.push('/worker-success');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ 
                  headerTitle: 'Register as a Worker',
                  headerShown: true,
                  headerTitleStyle: {
                    fontSize: 20,
                  },
                }} />
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topSpacing} />
          <ThemedText style={styles.title}>Worker Profile</ThemedText>
          <ThemedText style={styles.subtitle}>Enter your details to find work</ThemedText>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Full Name</ThemedText>
              <TextInput 
                style={[styles.input, { backgroundColor: inputBackground }]}
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Phone Number</ThemedText>
              <TextInput 
                style={[styles.input, { backgroundColor: inputBackground }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your contact number"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Location/City</ThemedText>
              <TextInput 
                style={[styles.input, { backgroundColor: inputBackground }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Where you're available to work"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Select Your Main Skill</ThemedText>
              {isLoading ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : (
                <View style={styles.skillsGrid}>
                  {skills.map(skill => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.skillButton,
                        { 
                          backgroundColor: skill === selectedSkill ? primaryColor : inputBackground
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
              <ThemedText style={styles.label}>Available Today?</ThemedText>
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
              <ThemedText style={styles.submitText}>Submit Profile</ThemedText>
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
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSpacing: {
    height: 20, // Add space between header and content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.7,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    minHeight: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});