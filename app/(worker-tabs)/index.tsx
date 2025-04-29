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
} from '@/app/services/workerService';
import * as Haptics from 'expo-haptics';
import i18n from '@/app/i18n/i18n';

export default function WorkerWaitingScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showResetNotification, setShowResetNotification] = useState<boolean>(false);
  // Mock data for waiting workers count - to be replaced with actual API call later
  const [waitingWorkersCount, setWaitingWorkersCount] = useState<number>(22);
  
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const dangerColor = useThemeColor({ light: '#ef4444', dark: '#f87171' }, 'text');
  const warningColor = useThemeColor({ light: '#f59e0b', dark: '#fbbf24' }, 'text');
  const cardBackground = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  const secondaryColor = useThemeColor({ light: '#64748b', dark: '#94a3b8' }, 'text');
  const params = useLocalSearchParams<{ newRegistration?: string }>();

  // Load profile and check for reset notification
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        const profileData = await getWorkerProfile();
        console.log('Profile data:', profileData);
        setProfile(profileData);

        // TODO: Replace with actual API call to get waiting workers count
        // Example: const count = await getWaitingWorkersCount();
        // setWaitingWorkersCount(count);

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
          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: primaryColor }]} />
            <ThemedText style={styles.statusText}>{i18n.t('workerWaiting.statusText')}</ThemedText>
          </View>

          <WaitingIllustration />

          <ThemedText style={styles.title}>{i18n.t('workerWaiting.title')}</ThemedText>
          <ThemedText style={styles.subtitle}>{i18n.t('workerWaiting.subtitle')}</ThemedText>

          {/* Waiting Workers Metrics Card */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={[styles.metricsCard, { backgroundColor: cardBackground }]}
          >
            <View style={styles.metricsContent}>
              <View style={styles.metricsIconContainer}>
                <Ionicons name="people-outline" size={28} color={primaryColor} />
              </View>
              <View style={styles.metricsTextContainer}>
                <ThemedText style={styles.metricsCount}>{waitingWorkersCount}</ThemedText>
                <ThemedText style={styles.metricsLabel}>
                  {i18n.t('workerWaiting.otherWorkersWaiting')}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.metricsFooter}>
              {i18n.t('workerWaiting.youAreNotAlone')}
            </ThemedText>
          </Animated.View>

          <View style={styles.userInfoBadge}>
            <Ionicons name="person-circle-outline" size={20} color={secondaryColor} />
            <ThemedText style={styles.userInfoText}>
              {profile.name} • {profile.skill}
            </ThemedText>
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
    marginBottom: 8,
  },
  metricsCard: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricsTextContainer: {
    flex: 1,
  },
  metricsCount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  metricsLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  metricsFooter: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  userInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  userInfoText: {
    marginLeft: 6,
    fontSize: 12,
    opacity: 0.7,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
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