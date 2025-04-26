import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { useTheme } from '@/app/theme/useTheme';
import { getWorkerProfile, isWorkerAvailable, setWorkerUnavailable } from '@/services/storageService';
import i18n from '@/app/i18n/i18n';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Share } from 'react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const theme = useTheme();
  const navigation = useNavigation();

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
    try {
      const profileData = await getWorkerProfile();
      setProfile(profileData);
      
      const availabilityStatus = await isWorkerAvailable();
      setIsAvailable(availabilityStatus);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleProfileEdit = () => {
    // In a complete app, this would navigate to edit profile
    router.push('/worker-registration');
  };

  const handleShareProfile = async () => {
    if (!profile) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await Share.share({
        message: `Check out my worker profile on Lmoqf: ${profile.name} - ${profile.skill} - Contact: ${profile.phone}`,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const toggleAvailability = async () => {
    if (isAvailable) {
      // If currently available, ask for confirmation to become unavailable
      Alert.alert(
        "Confirm Status Change",
        "Are you sure you want to make yourself unavailable for work?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, I'm Unavailable",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await setWorkerUnavailable();
              setIsAvailable(false);
            }
          }
        ]
      );
    } else {
      // If currently unavailable, go to waiting screen to become available
      router.push({
        pathname: '/worker-waiting',
        // Using replace option to prevent going back
        params: { replace: true }
      });
    }
  };

  // If no profile exists
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
            No Profile Yet
          </ThemedText>
          
          <ThemedText style={[styles.noProfileDesc, { 
            color: theme.colors.textSecondary,
            fontSize: theme.fontSizes.md,
            marginBottom: 32,
            textAlign: 'center',
          }]}>
            Create your worker profile to get discovered by employers in your area
          </ThemedText>
          
          <Button
            title="Create Worker Profile"
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
                  {profile.skill}
                </ThemedText>
              </View>
              
              {isAvailable && (
                <View style={styles.availabilityBadge}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.tertiary }]} />
                  <ThemedText style={[styles.availabilityText, { color: theme.colors.tertiary }]}>
                    Available Now
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
              Availability Status
            </ThemedText>
            <View style={[styles.statusIndicator, { 
              backgroundColor: isAvailable ? theme.colors.tertiary : theme.colors.textSecondary 
            }]} />
          </View>
          
          <ThemedText style={[styles.statusDescription, { color: theme.colors.textSecondary }]}>
            {isAvailable 
              ? "You're currently available for work. Employers can find and contact you."
              : "You're currently marked as unavailable. Update your status when you're ready to work."
            }
          </ThemedText>
          
          <Button
            title={isAvailable ? "I'm No Longer Available" : "Make Me Available"}
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
            Contact Information
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
            title="Share Contact Info"
            variant="outline"
            icon="share-social-outline"
            onPress={handleShareProfile}
            style={{ marginTop: theme.spacing.lg }}
          />
        </Card>
        
        {/* Additional Actions */}
        <Card style={styles.actionsCard} variant={isAvailable ? "elevated" : "flat"}>
          {isAvailable && (
            <Button
              title="View Waiting Status"
              variant="primary"
              icon="time-outline"
              onPress={() => router.push('/worker-waiting')}
              style={{ marginBottom: theme.spacing.md }}
            />
          )}
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
});