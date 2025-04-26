import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageProvider } from '@/app/i18n/LanguageContext';
import { UserRoleProvider } from '@/app/context/UserRoleContext';
import { useTheme } from './theme/useTheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <UserRoleProvider>
            <Stack 
              initialRouteName="(tabs)"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colorScheme === 'dark' ? '#111827' : '#fff' },
                headerLargeTitle: false,
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen 
                name="onboarding" 
                options={{ 
                  headerShown: false,
                  // Prevent going back to onboarding once in the app
                  gestureEnabled: false,
                }} 
              />
              <Stack.Screen 
                name="(tabs)" 
                options={{ 
                  headerShown: false,
                  // Prevent going back to onboarding
                  gestureEnabled: false,
                }} 
              />
              <Stack.Screen 
                name="worker-registration" 
                options={{ 
                  headerShown: true,
                  headerTitle: "Register as a Worker", 
                  headerTitleStyle: { 
                    fontSize: 20,
                    fontWeight: '600',
                  },
                  headerBackTitleVisible: false,
                }} 
              />
              <Stack.Screen 
                name="worker-success" 
                options={{ 
                  headerShown: false,
                  // Prevent going back after success
                  gestureEnabled: false,
                }} 
              />
              <Stack.Screen 
                name="worker-waiting" 
                options={{ 
                  headerShown: false,
                  // Prevent going back during waiting state
                  gestureEnabled: false,
                }} 
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </UserRoleProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
