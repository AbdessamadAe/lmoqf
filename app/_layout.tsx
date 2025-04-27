import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageProvider } from '@/app/i18n/LanguageContext';
import { UserRoleProvider } from '@/app/context/UserRoleContext';
import { useTheme } from './theme/useTheme';
import { View, ActivityIndicator } from 'react-native';

// Import types for better navigation type safety
import { RootStackParamList } from './types/navigation';

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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <UserRoleProvider>
            <Stack
              initialRouteName="index"
              screenOptions={{
                contentStyle: { backgroundColor: colorScheme === 'dark' ? '#111827' : '#fff' },
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#111827' : '#fff',
                },
                headerTintColor: theme.colors.textPrimary,
                animation: 'slide_from_right',
              }}
            >
              {/* Onboarding group with its own layout */}
              <Stack.Screen
                name="(onboarding)"
                options={{
                  headerShown: false,
                  headerTitle: 'Welcome', 
                }}
              />

              {/* Worker tabs - separate navigation group */}
              <Stack.Screen
                name="(worker-tabs)"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />

              {/* Hirer tabs - separate navigation group */}
              <Stack.Screen
                name="(hirer-tabs)"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />

              {/* Error screens */}
              <Stack.Screen 
                name="+not-found" 
                options={{
                  presentation: 'modal',
                  title: 'Not Found'
                }}
              />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </UserRoleProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
