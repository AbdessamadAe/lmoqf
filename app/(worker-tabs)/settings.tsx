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
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { logoutWorker } from '@/app/services/workerService';

// Settings item component
const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  onPress, 
  iconColor = '#4F46E5',
  isLast = false,
  rightElement
}: { 
  icon: string; 
  title: string; 
  description?: string; 
  onPress?: () => void;
  iconColor?: string;
  isLast?: boolean;
  rightElement?: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.settingsItem, 
        { 
          borderBottomWidth: isLast ? 0 : 1, 
          borderBottomColor: theme.colors.border 
        }
      ]}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
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
      {rightElement}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { locale, changeLanguage } = useLanguage();

  // Set the header title
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: i18n.t('settingsTitle'),
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      i18n.t('settings.logoutConfirmTitle'),
      i18n.t('settings.logoutConfirmMessage'),
      [
        {
          text: i18n.t('cancel'),
          style: "cancel"
        },
        {
          text: i18n.t('settings.logoutButton'),
          onPress: async () => {
            try {
              await logoutWorker();
              // Redirect to onboarding screen
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to log out. Please try again.');
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
    return '1.0.0'; // Web or default version
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Language */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { 
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semiBold
          }]}>
            {i18n.t('settings.language')}
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            <View style={[styles.settingsItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="language" size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsItemContent}>
                <ThemedText style={[styles.settingsItemTitle, { 
                  color: theme.colors.textPrimary,
                  fontWeight: theme.fontWeights.semiBold,
                  fontSize: theme.fontSizes.md,
                }]}>
                  {i18n.t('settings.appLanguage')}
                </ThemedText>
              </View>
              <LanguageSelector />
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
            {i18n.t('settings.support')}
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            <SettingsItem 
              icon="help-circle"
              title={i18n.t('settings.contactSupport')}
              description={i18n.t('settings.contactSupportDescription')}
              onPress={handleContactSupport}
              iconColor="#F59E0B"
            />
            <SettingsItem 
              icon="shield-checkmark"
              title={i18n.t('settings.privacyPolicy')}
              onPress={handlePrivacyPolicy}
              iconColor="#10B981"
            />
            <SettingsItem 
              icon="document-text"
              title={i18n.t('settings.termsOfService')}
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
            {i18n.t('settings.account')}
          </ThemedText>
          
          <Card style={styles.card} variant="elevated">
            <SettingsItem 
              icon="log-out"
              title={i18n.t('settings.logout')}
              description={i18n.t('settings.logoutDescription')}
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