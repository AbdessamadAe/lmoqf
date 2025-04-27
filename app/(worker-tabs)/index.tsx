import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, AppState, AppStateStatus, Share, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WaitingIllustration } from '@/components/illustrations/WaitingIllustration';
import { Ionicons } from '@expo/vector-icons';
import { getWorkerAvailability, getWorkerProfile, setWorkerUnavailable, getWaitingDuration } from '@/app/services/workerService';
import * as Haptics from 'expo-haptics';
import i18n from '@/app/i18n/i18n';

export default function WorkerWaitingScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'tint');
  const dangerColor = useThemeColor({ light: '#ef4444', dark: '#f87171' }, 'text');
  const cardBackground = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  const params = useLocalSearchParams<{ newRegistration?: string }>();

  // Load profile
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        const profileData = await getWorkerProfile();
        console.log('Profile data:', profileData);
        setProfile(profileData);

      } catch (error) {
        console.error('Failed to load profile data:', error);
        Alert.alert(i18n.t('cancel'), 'Failed to load profile data');
        router.replace('/(worker-tabs)');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [params.newRegistration]);

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
      Alert.alert(i18n.t('cancel'), 'Could not share your information');
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
      Alert.alert(i18n.t('cancel'), 'Could not update your availability status');
    }
  };

  if (!profile) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>{i18n.t('loading')}</ThemedText>
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
          <ThemedText style={styles.subtitle}>
            {i18n.t('workerWaiting.subtitle')}
          </ThemedText>
          
          <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={22} color={primaryColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>{i18n.t('workerWaiting.yourName')}</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.name}</ThemedText>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={22} color={primaryColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>{i18n.t('workerWaiting.contactNumber')}</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.phone}</ThemedText>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="construct-outline" size={22} color={primaryColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>{i18n.t('workerWaiting.skill')}</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.skill}</ThemedText>
              </View>
            </View>
          </View>
          
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
    padding: 20,
    paddingTop: 35,
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
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
    marginVertical: 16,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  }
});