import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/theme/useTheme';
import { HapticTab } from '@/components/HapticTab';
import i18n from '@/app/i18n/i18n';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useUserRole } from '@/app/context/UserRoleContext';
import { ActivityIndicator, View } from 'react-native';

export default function TabsLayout() {
  const theme = useTheme();
  const { isRTL } = useLanguage();
  const { userRole, isLoading, isWorker, isHirer } = useUserRole();
  
  // Show loading screen when checking user role
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  // If no user role is set, redirect to onboarding
  if (!userRole) {
    return <Redirect href="/onboarding" />;
  }
  
  // Get translations as strings instead of objects
  const homeLabel = String(i18n.t('home'));
  const profileLabel = isWorker ? String(i18n.t('profile')) : "My Account";
  const settingsLabel = String(i18n.t('settingsTitle'));
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.isDark ? theme.colors.textSecondary : '#6B7280',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderTopWidth: 0.5,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          ...(Platform.OS === 'ios' && {
            height: 80,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        ...(Platform.OS === 'ios' && {
          tabBarBackground: () => (
            <BlurView
              tint={theme.isDark ? 'dark' : 'light'}
              intensity={90}
              style={{ flex: 1 }}
            />
          )
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: homeLabel,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      {/* The Profile tab is more relevant to workers but accessible to both */}
      <Tabs.Screen
        name="profile"
        options={{
          title: profileLabel,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      
      {/* Settings is accessible to all users */}
      <Tabs.Screen
        name="settings"
        options={{
          title: settingsLabel,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}