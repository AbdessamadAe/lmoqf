import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, AppState, AppStateStatus, Share } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WaitingIllustration } from '@/components/illustrations/WaitingIllustration';
import { Ionicons } from '@expo/vector-icons';
import { getWorkerAvailability, getWorkerProfile, setWorkerUnavailable, getWaitingDuration } from '@/services/storageService';
import * as Haptics from 'expo-haptics';

export default function WorkerWaitingScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const dangerColor = useThemeColor({ light: '#ef4444', dark: '#f87171' }, 'text');
  const cardBackground = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');

  // Load profile and start timer
  useEffect(() => {
    const loadProfileData = async () => {
      const profileData = await getWorkerProfile();
      setProfile(profileData);
      
      // Get initial waiting time
      const duration = await getWaitingDuration();
      if (duration !== null) {
        setWaitingTime(duration);
      }
    };
    
    loadProfileData();
    
    // Set up interval to update waiting time
    const timer = setInterval(async () => {
      const duration = await getWaitingDuration();
      if (duration !== null) {
        setWaitingTime(duration);
      }
    }, 60000); // Update every minute
    
    // App state change handler to refresh when app comes to foreground
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  
  // Handle app coming to foreground
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground
      const duration = await getWaitingDuration();
      if (duration !== null) {
        setWaitingTime(duration);
      }
      
      // Check if worker is still available (in case storage was cleared elsewhere)
      const availability = await getWorkerAvailability();
      if (!availability) {
        router.replace('/onboarding');
      }
    }
    setAppState(nextAppState);
  };

  // Format waiting time into hours and minutes
  const formatWaitingTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
  };

  // Share contact info
  const handleShare = async () => {
    if (!profile) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await Share.share({
        message: `I'm available for work today! Contact me at: ${profile.phone} - ${profile.name} (${profile.skill})`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Become unavailable and go back to onboarding
  const handleFinishWaiting = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setWorkerUnavailable();
    // Navigate to profile screen instead of onboarding
    router.replace('/(worker-tabs)/profile');
  };

  if (!profile) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: primaryColor }]} />
            <ThemedText style={styles.statusText}>You are available for work</ThemedText>
          </View>
          
          <WaitingIllustration />
          
          <ThemedText style={styles.title}>Waiting for calls</ThemedText>
          <ThemedText style={styles.subtitle}>
            Employers can see your profile and may call you soon
          </ThemedText>
          
          <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
            
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={22} color={primaryColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Your Name</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.name}</ThemedText>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={22} color={primaryColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Contact Number</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.phone}</ThemedText>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="construct-outline" size={22} color={primaryColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Skill</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.skill}</ThemedText>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: dangerColor }]}
            onPress={handleFinishWaiting}
          >
            <ThemedText style={[styles.cancelButtonText, { color: dangerColor }]}>
              I'm No Longer Available
            </ThemedText>
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
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    maxWidth: '90%',
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
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
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});