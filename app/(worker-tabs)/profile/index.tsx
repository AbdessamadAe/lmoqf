import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { useTheme } from '@/app/theme/useTheme';
import { getWorkerProfile, isWorkerAvailable, setWorkerUnavailable, setWorkerAvailable } from '@/app/services/workerService';
import i18n from '@/app/i18n/i18n';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Share } from 'react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const theme = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ newRegistration?: string }>();
  
  // Set the header title
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: i18n.t('profile'),
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTitleStyle: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
      },
      headerShadowVisible: false,
    });
  }, [navigation, theme]);

  // Load profile data
  useEffect(() => {
    loadProfileData();
  }, []);
  
  const loadProfileData = async () => {
    setIsLoading(true);
    try {      
      const profileData = await getWorkerProfile();
      console.log('Profile Data:', profileData);
      if (profileData) {
        setProfile(profileData);
        const availabilityStatus = await isWorkerAvailable();
        setIsAvailable(availabilityStatus);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
      Alert.alert(i18n.t('editProfile.error'), i18n.t('editProfile.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileEdit = () => {
    router.push('/profile/edit-profile');
  };

  const handleShareProfile = async () => {
    if (!profile) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await Share.share({
        message: i18n.t('workerProfile.shareProfileMessage', {
          name: profile.name,
          skill: profile.skill,
          phone: profile.phone
        }),
      });
    } catch (error) {
      Alert.alert(i18n.t('cancel'), i18n.t('workerProfile.shareError', 'Could not share your profile'));
    }
  };

  const toggleAvailability = async () => {
    if (isAvailable) {
      // If currently available, ask for confirmation to become unavailable
      Alert.alert(
        i18n.t('workerProfile.statusChangeTitle'),
        i18n.t('workerProfile.statusChangeMessage'),
        [
          { text: i18n.t('cancel'), style: "cancel" },
          {
            text: i18n.t('submit'), 
            onPress: async () => {
              try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await setWorkerUnavailable();
                setIsAvailable(false);
              } catch (error) {
                Alert.alert(i18n.t('cancel'), i18n.t('workerProfile.availabilityError', 'Could not update availability status'));
              }
            }
          }
        ]
      );
    } else {
      // If currently unavailable, set them as available
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await setWorkerAvailable(profile.phone);
        setIsAvailable(true);
      } catch (error) {
        Alert.alert(i18n.t('cancel'), i18n.t('workerProfile.availabilityError', 'Could not update availability status'));
      }
    }
  };

  // If still loading, show loading spinner
  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText style={styles.loadingText}>
            {i18n.t('loading', 'Loading...')}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // If no profile exists, show empty state
  if (!profile) {
    return (
      <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <ThemedView style={styles.noProfileContainer}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="person-circle-outline" size={80} color={theme.colors.primary} />
          </View>
          
          <ThemedText style={[styles.noProfileTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.xxl,
            fontWeight: theme.fontWeights.bold
          }]}>
            {i18n.t('workerProfile.noProfileTitle')}
          </ThemedText>
          
          <ThemedText style={[styles.noProfileDesc, { 
            color: theme.colors.textSecondary,
            fontSize: theme.fontSizes.md,
            marginBottom: 32,
            textAlign: 'center',
          }]}>
            {i18n.t('workerProfile.noProfileDescription')}
          </ThemedText>
          
          <Button
            title={i18n.t('workerProfile.createProfile')}
            variant="primary"
            icon="person-add"
            onPress={() => router.push('/worker-registration')}
            style={{ marginBottom: theme.spacing.lg }}
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Profile Header */}
        <Card style={styles.profileHeaderCard} variant="elevated">
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <ThemedText style={[styles.avatarText, { 
                color: theme.colors.primary,
                fontSize: 32,
                fontWeight: theme.fontWeights.bold
              }]}>
                {profile.name.charAt(0)}
              </ThemedText>
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText style={[styles.profileName, { 
                color: theme.colors.textPrimary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontWeights.bold
              }]}>
                {profile.name}
              </ThemedText>
              
              <View style={[styles.skillBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="construct-outline" size={14} color={theme.colors.primary} />
                <ThemedText style={[styles.skillText, { color: theme.colors.primary }]}>
                  {i18n.t(`skills.${profile.skill}`)}
                </ThemedText>
              </View>
              
              {isAvailable && (
                <View style={styles.availabilityBadge}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.tertiary }]} />
                  <ThemedText style={[styles.availabilityText, { color: theme.colors.tertiary }]}>
                    {i18n.t('workerProfile.availableNow')}
                  </ThemedText>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              onPress={handleProfileEdit}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Status Toggle */}
        <Card style={styles.statusCard} variant="elevated">
          <View style={styles.statusHeader}>
            <ThemedText style={[styles.statusTitle, { 
              color: theme.colors.textPrimary,
              fontSize: theme.fontSizes.md,
              fontWeight: theme.fontWeights.semiBold
            }]}>
              {i18n.t('workerProfile.availabilityStatus')}
            </ThemedText>
            <View style={[styles.statusIndicator, { 
              backgroundColor: isAvailable ? theme.colors.tertiary : theme.colors.textSecondary 
            }]} />
          </View>
          
          <ThemedText style={[styles.statusDescription, { color: theme.colors.textSecondary }]}>
            {isAvailable 
              ? i18n.t('workerProfile.availabilityToggleEnabled')
              : i18n.t('workerProfile.availabilityToggleDisabled')
            }
          </ThemedText>
          
          <Button
            title={isAvailable ? i18n.t('workerProfile.noLongerAvailable') : i18n.t('workerProfile.makeAvailable')}
            variant={isAvailable ? "outline" : "primary"}
            icon={isAvailable ? "close-circle" : "checkmark-circle"}
            onPress={toggleAvailability}
            style={{ marginTop: theme.spacing.md }}
          />
        </Card>
        
        {/* Contact Information */}
        <Card style={styles.contactCard} variant="elevated">
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            {i18n.t('workerProfile.contactInformation')}
          </ThemedText>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} style={styles.infoIcon} />
            <ThemedText style={{ color: theme.colors.textPrimary }}>
              {profile.phone}
            </ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} style={styles.infoIcon} />
            <ThemedText style={{ color: theme.colors.textPrimary }}>
              {profile.location}
            </ThemedText>
          </View>
          
          <Button
            title={i18n.t('workerProfile.shareProfile')}
            variant="outline"
            icon="share-social-outline"
            onPress={handleShareProfile}
            style={{ marginTop: theme.spacing.lg }}
          />
        </Card>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  noProfileTitle: {
    marginBottom: 16,
  },
  noProfileDesc: {
    textAlign: 'center',
    marginBottom: 32,
  },
  profileHeaderCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: 8,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusTitle: {
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  contactCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 24,
  },
  actionsCard: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
});