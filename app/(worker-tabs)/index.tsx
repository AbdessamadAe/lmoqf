import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, AppState, AppStateStatus, Share, Alert, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WaitingIllustration } from '@/components/illustrations/WaitingIllustration';
import { Ionicons } from '@expo/vector-icons';
import { 
  getWorkerAvailability, 
  getWorkerProfile, 
  setWorkerUnavailable, 
  setWorkerAvailable,
  getWaitingDuration, 
  hasAvailabilityResetNotification, 
  clearAvailabilityResetNotification,
  startAvailabilityResetCheck
} from '@/app/services/workerService';
import * as Haptics from 'expo-haptics';
import i18n from '@/app/i18n/i18n';

export default function WorkerWaitingScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showResetNotification, setShowResetNotification] = useState<boolean>(false);
  
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const dangerColor = useThemeColor({ light: '#ef4444', dark: '#f87171' }, 'text');
  const warningColor = useThemeColor({ light: '#f59e0b', dark: '#fbbf24' }, 'text');
  const cardBackground = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  const params = useLocalSearchParams<{ newRegistration?: string }>();

  // Check for availability reset when app comes to foreground
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (appState !== nextAppState) {
      setAppState(nextAppState);
      
      if (nextAppState === 'active') {
        // Check if there's a reset notification when app becomes active
        checkForResetNotification();
      }
    }
  }, [appState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  // Load profile and check for reset notification
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Start the availability reset check system
        await startAvailabilityResetCheck();
        
        // Check if there's a reset notification
        await checkForResetNotification();
        
        const profileData = await getWorkerProfile();
        console.log('Profile data:', profileData);
        setProfile(profileData);

      } catch (error) {
        console.error('Failed to load profile data:', error);
        Alert.alert(
          i18n.t('cancel'), 
          i18n.t('editProfile.error')
        );
        router.replace('/(worker-tabs)');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [params.newRegistration]);

  // Check if there's a reset notification to show
  const checkForResetNotification = async () => {
    const hasNotification = await hasAvailabilityResetNotification();
    setShowResetNotification(hasNotification);
  };

  // Share contact info
  const handleShare = async () => {
    if (!profile) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await Share.share({
        message: i18n.t('workerWaiting.shareMessage', {
          phone: profile.phone,
          name: profile.name,
          skill: profile.skill
        }),
      });
    } catch (error) {
      Alert.alert(i18n.t('cancel'), i18n.t('settings.contactSupportDescription'));
    }
  };

  // Become unavailable and go back to profile
  const handleFinishWaiting = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setWorkerUnavailable();
      // Navigate to profile screen instead of onboarding
      router.replace('/(worker-tabs)/profile');
    } catch (error) {
      Alert.alert(
        i18n.t('cancel'), 
        i18n.t('workerProfile.statusChangeMessage')
      );
    }
  };

  // Set worker available again after reset
  const handleSetAvailable = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setWorkerAvailable();
      await clearAvailabilityResetNotification();
      setShowResetNotification(false);
      
      // Refresh profile to show updated status
      const profileData = await getWorkerProfile();
      setProfile(profileData);
      
      Alert.alert(
        i18n.t('success'), 
        i18n.t('workerWaiting.availableAgain')
      );
    } catch (error) {
      Alert.alert(
        i18n.t('cancel'), 
        i18n.t('workerProfile.statusChangeMessage')
      );
    }
  };

  // Dismiss the reset notification
  const handleDismissNotification = async () => {
    await clearAvailabilityResetNotification();
    setShowResetNotification(false);
  };

  if (!profile) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <ThemedText style={styles.loadingText}>{i18n.t('loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          {/* Reset Notification */}
          {showResetNotification && (
            <View style={[styles.notificationCard, { backgroundColor: warningColor + '20' }]}>
              <View style={styles.notificationHeader}>
                <Ionicons name="time-outline" size={20} color={warningColor} />
                <ThemedText style={[styles.notificationTitle, { color: warningColor }]}>
                  {i18n.t('workerWaiting.resetNotificationTitle')}
                </ThemedText>
                <TouchableOpacity onPress={handleDismissNotification}>
                  <Ionicons name="close-outline" size={20} color={warningColor} />
                </TouchableOpacity>
              </View>
              <ThemedText style={styles.notificationText}>
                {i18n.t('workerWaiting.resetNotificationMessage')}
              </ThemedText>
              <TouchableOpacity
                style={[styles.notificationButton, { backgroundColor: warningColor }]}
                onPress={handleSetAvailable}
              >
                <ThemedText style={[styles.notificationButtonText, { color: '#fff' }]}>
                  {i18n.t('workerWaiting.setAvailableAgain')}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: primaryColor }]} />
            <ThemedText style={styles.statusText}>{i18n.t('workerWaiting.statusText')}</ThemedText>
          </View>

          <WaitingIllustration />

          <ThemedText style={styles.title}>{i18n.t('workerWaiting.title')}</ThemedText>
          <ThemedText style={styles.subtitle}>{i18n.t('workerWaiting.subtitle')}</ThemedText>

          {/* Profile Info */}
          <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={primaryColor} style={styles.infoIcon} />
              <ThemedText style={styles.infoValue}>{profile.name}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={primaryColor} style={styles.infoIcon} />
              <ThemedText style={styles.infoValue}>{profile.phone}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="construct-outline" size={20} color={primaryColor} style={styles.infoIcon} />
              <ThemedText style={styles.infoValue}>{profile.skill}</ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: dangerColor }]}
            onPress={handleFinishWaiting}
          >
            <ThemedText style={[styles.cancelButtonText, { color: dangerColor }]}>
              {i18n.t('workerWaiting.noLongerAvailable')}
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
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  infoCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 12,
  },
  notificationButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  notificationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
});