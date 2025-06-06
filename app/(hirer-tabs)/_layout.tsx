import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/theme/useTheme';
import { HapticTab } from '@/components/HapticTab';
import i18n from '@/app/i18n/i18n';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { useUserRole } from '@/app/context/UserRoleContext';
import { ActivityIndicator, View } from 'react-native';

// Import navigation types for type safety
import { HirerTabsParamList } from '../types/navigation';

export default function HirerTabsLayout() {
  const theme = useTheme();
  const { userRole, isLoading, isHirer } = useUserRole();
  
  // Show loading screen when checking user role
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  // If no user role is set or user is not a hirer, redirect to onboarding
  if (!userRole || !isHirer) {
    return <Redirect href="/(onboarding)" />;
  }
  
  // Get translations as strings instead of objects
  const homeLabel = String(i18n.t('home'));
  const workersLabel = String(i18n.t('workers'));
  const settingsLabel = String(i18n.t('settingsTitle'));
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.isDark ? theme.colors.textSecondary : theme.colors.textSecondary,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.isDark ? `${theme.colors.background}CC` : `${theme.colors.background}CC`, // CC = 80% opacity
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
        ...({
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
      {/* Home/Dashboard Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: homeLabel,
          headerTitle: homeLabel,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      {/* Workers Listing Screen */}
      <Tabs.Screen
        name="workers"
        options={{
          title: workersLabel,
          headerTitle: workersLabel,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      
      {/* Settings Screen */}
      <Tabs.Screen
        name="settings"
        options={{
          title: settingsLabel,
          headerTitle: settingsLabel,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}