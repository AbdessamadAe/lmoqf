import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/app/components/Card';
import { useTheme } from '@/app/theme/useTheme';
import i18n from '@/app/i18n/i18n';
import { StatusBar } from 'expo-status-bar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/app/i18n/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { locale, isRTL } = useLanguage();

  // Set the header title
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: i18n.t('settings'),
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

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      "Log Out", 
      "Are you sure you want to log out?", 
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: async () => {
            // Clear worker data
            try {
              await AsyncStorage.multiRemove([
                '@lmoqf:worker_profile',
                '@lmoqf:worker_available',
                '@lmoqf:waiting_start_time'
              ]);
              // In a real app, you'd redirect to the login screen
              Alert.alert("Logged out successfully");
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@lmoqf.com?subject=Support%20Request');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://lmoqf.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://lmoqf.com/terms');
  };

  const getAppVersion = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      return Application.nativeApplicationVersion || '1.0.0';
    }
    return '1.0.0'; // Default for web
  };

  // Settings item component
  const SettingsItem = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    isLast = false,
    iconColor = theme.colors.primary,
  }) => (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.settingsItem, 
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.settingsItemContent}>
        <ThemedText style={[styles.settingsItemTitle, { 
          color: theme.colors.textPrimary,
          fontWeight: theme.fontWeights.semiBold,
          fontSize: theme.fontSizes.md,
        }]}>
          {title}
        </ThemedText>
        {description && (
          <ThemedText style={[styles.settingsItemDescription, { 
            color: theme.colors.textSecondary,
            fontSize: theme.fontSizes.sm,
          }]}>
            {description}
          </ThemedText>
        )}
      </View>
      <Ionicons 
        name={isRTL ? "chevron-back" : "chevron-forward"} 
        size={18} 
        color={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* App Preferences */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            App Preferences
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            {/* Language */}
            <View style={[styles.settingsItem, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="language" size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsItemContent}>
                <ThemedText style={[styles.settingsItemTitle, { 
                  color: theme.colors.textPrimary,
                  fontWeight: theme.fontWeights.semiBold,
                  fontSize: theme.fontSizes.md,
                }]}>
                  Language
                </ThemedText>
                <LanguageSelector minimal={true} />
              </View>
            </View>
            
            {/* Notifications */}
            <View style={[styles.settingsItem, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary + '15' }]}>
                <Ionicons name="notifications" size={22} color={theme.colors.secondary} />
              </View>
              <View style={styles.settingsItemContent}>
                <ThemedText style={[styles.settingsItemTitle, { 
                  color: theme.colors.textPrimary,
                  fontWeight: theme.fontWeights.semiBold,
                  fontSize: theme.fontSizes.md,
                }]}>
                  Notifications
                </ThemedText>
                <ThemedText style={[styles.settingsItemDescription, { 
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.sm,
                }]}>
                  Get notified about new opportunities
                </ThemedText>
              </View>
              <Switch 
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            {/* Dark Mode */}
            <View style={styles.settingsItem}>
              <View style={[styles.iconContainer, { backgroundColor: theme.isDark ? '#7C3AED15' : '#6B728015' }]}>
                <Ionicons name={theme.isDark ? "moon" : "sunny"} size={22} color={theme.isDark ? '#7C3AED' : '#6B7280'} />
              </View>
              <View style={styles.settingsItemContent}>
                <ThemedText style={[styles.settingsItemTitle, { 
                  color: theme.colors.textPrimary,
                  fontWeight: theme.fontWeights.semiBold,
                  fontSize: theme.fontSizes.md,
                }]}>
                  Dark Mode
                </ThemedText>
                <ThemedText style={[styles.settingsItemDescription, { 
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.sm,
                }]}>
                  Uses system setting
                </ThemedText>
              </View>
              <Switch 
                value={theme.isDark}
                disabled={true} // Using system setting
                onValueChange={() => {}}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        </View>
        
        {/* Support */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            Support
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            <SettingsItem 
              icon="help-circle"
              title="Help Center"
              description="Find answers to common questions"
              onPress={() => {}}
              iconColor={theme.colors.primary}
            />
            <SettingsItem 
              icon="mail"
              title="Contact Support"
              description="Get help with any issues"
              onPress={handleContactSupport}
              iconColor="#F59E0B"
            />
            <SettingsItem 
              icon="star"
              title="Rate the App"
              description="Let us know what you think"
              onPress={() => {}}
              iconColor="#F43F5E"
              isLast={true}
            />
          </Card>
        </View>
        
        {/* Legal */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            Legal
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            <SettingsItem 
              icon="shield-checkmark"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
              iconColor="#10B981"
            />
            <SettingsItem 
              icon="document-text"
              title="Terms of Service"
              onPress={handleTermsOfService}
              iconColor="#3B82F6"
              isLast={true}
            />
          </Card>
        </View>
        
        {/* Account */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            Account
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            <SettingsItem 
              icon="log-out"
              title="Log Out"
              description="Sign out of your account"
              onPress={handleLogout}
              iconColor={theme.colors.notification}
              isLast={true}
            />
          </Card>
        </View>
        
        {/* Version */}
        <View style={styles.versionContainer}>
          <ThemedText style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Lmoqf v{getAppVersion()}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  card: {
    padding: 0, // Remove default padding as we control it in items
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    marginBottom: 4,
  },
  settingsItemDescription: {
    lineHeight: 18,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
  },
});