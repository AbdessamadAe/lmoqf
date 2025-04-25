import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack 
          initialRouteName="onboarding"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' },
            headerStyle: {
              height: 100, // Provide more space for header
            },
            headerLargeTitle: true,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="worker-registration" 
            options={{ 
              headerShown: true,
              headerTitle: "Worker Registration", 
              headerTitleStyle: { 
                fontSize: 20,
              },
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen name="worker-success" options={{ headerShown: false }} />
          <Stack.Screen 
            name="available-workers" 
            options={{ 
              headerShown: true, 
              headerTitle: "Available Workers", 
              headerTitleStyle: { 
                fontSize: 20,
              },
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
