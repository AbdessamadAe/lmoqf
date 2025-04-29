import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withRepeat, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { getWorkerProfile, setWorkerUnavailable } from '@/app/services/workerService';
import * as Haptics from 'expo-haptics';
import i18n from '@/app/i18n/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/app/theme/useTheme';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from '@/app/i18n/LanguageContext';

export default function WorkerWaitingScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Mock data for waiting workers count - to be replaced with actual API call later
  const [waitingWorkersCount, setWaitingWorkersCount] = useState<number>(22);
  const [timeWaiting, setTimeWaiting] = useState<string>("00:00:00");
  
  const theme = useTheme();
  const { isRTL } = useLanguage();
  const params = useLocalSearchParams<{ newRegistration?: string }>();
  const insets = useSafeAreaInsets();
  
  // Pulse animation for status indicator
  const pulseValue = useSharedValue(1);
  
  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );
  }, []);
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });

  // Load profile and check for reset notification
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const profileData = await getWorkerProfile();
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
    
    // Update the waiting time every second
    const timer = setInterval(() => {
      // This is mock implementation. In production, calculate actual time from start
      const now = new Date();
      const hours = String(now.getHours() % 2).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeWaiting(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [params.newRegistration]);

  // Become unavailable and go back to profile
  const handleFinishWaiting = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setWorkerUnavailable();
      router.replace('/(worker-tabs)/profile');
    } catch (error) {
      Alert.alert(
        i18n.t('cancel'), 
        i18n.t('workerProfile.statusChangeMessage')
      );
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={styles.loadingText}>{i18n.t('loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ThemedView style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        {/* Status Badge */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={[
            styles.statusContainer, 
            { borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 16 }
          ]}
        >
          <View style={[styles.statusWrapper, isRTL && styles.rtlRow]}>
            <Animated.View style={[styles.statusDot, { backgroundColor: theme.colors.tertiary }, pulseStyle]} />
            <ThemedText style={{
              fontSize: theme.fontSizes.md,
              fontWeight: theme.fontWeights.semiBold,
              color: theme.colors.tertiary
            }}>
              {i18n.t('workerWaiting.statusText')}
            </ThemedText>
          </View>
          <ThemedText style={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textSecondary
          }}>
            {timeWaiting}
          </ThemedText>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Header Section */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.headerSection}
          >
            <ThemedText style={{
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontWeights.bold,
              marginBottom: theme.spacing.sm,
              color: theme.colors.textPrimary
            }}>
              {i18n.t('workerWaiting.title')}
            </ThemedText>
            <ThemedText style={{
              fontSize: theme.fontSizes.md,
              color: theme.colors.textSecondary,
              lineHeight: 22
            }}>
              {i18n.t('workerWaiting.subtitle')}
            </ThemedText>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
          >
            <Card style={{ marginTop: theme.spacing.md }} variant="elevated">
              <View style={[
                styles.statRow,
                isRTL && styles.rtlRow
              ]}>
                <View style={[
                  styles.statIconWrapper, 
                  { backgroundColor: theme.colors.primary + '15' },
                  isRTL ? { marginLeft: 16, marginRight: 0 } : { marginRight: 16 }
                ]}>
                  <Ionicons name="people-outline" size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.statTextContainer}>
                  <ThemedText style={{
                    fontSize: theme.fontSizes.sm,
                    color: theme.colors.textSecondary
                  }}>
                    {i18n.t('workerWaiting.workersWaiting')}
                  </ThemedText>
                  <ThemedText style={{
                    fontSize: theme.fontSizes.xl,
                    fontWeight: theme.fontWeights.semiBold,
                    color: theme.colors.textPrimary
                  }}>
                    {waitingWorkersCount}
                  </ThemedText>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Info Section */}
          <Animated.View 
            entering={FadeInDown.delay(500).springify()}
            style={{ marginTop: theme.spacing.lg }}
          >
            <Card variant="outlined">
              <View style={[
                styles.infoSection,
                isRTL && styles.rtlRow
              ]}>
                <Ionicons 
                  name="information-outline" 
                  size={20} 
                  color={theme.colors.primary}
                  style={isRTL ? { marginLeft: theme.spacing.md } : { marginRight: theme.spacing.md }}
                />
                <ThemedText style={{
                  flex: 1,
                  fontSize: theme.fontSizes.md,
                  lineHeight: 22,
                  color: theme.colors.textSecondary
                }}>
                  {i18n.t('workerWaiting.youAreNotAlone')}
                </ThemedText>
              </View>
            </Card>
          </Animated.View>
        </View>

        {/* Action Button - Fixed positioning to ensure visibility on all screen sizes */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={[
            styles.actionContainer,
            { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 12) }
          ]}
        >
          <Button
            title={i18n.t('workerProfile.noLongerAvailable')}
            onPress={handleFinishWaiting}
            variant="outline"
            icon="close-circle"
            iconPosition={isRTL ? "left" : "right"}
          />
        </Animated.View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  mainContent: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 28,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  statTextContainer: {
    flex: 1,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionContainer: {
    width: '100%',
    marginBottom: 30,
  },
});